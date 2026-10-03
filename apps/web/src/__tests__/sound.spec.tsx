import { afterEach, describe, expect, it, vi } from 'vitest';
import { SOUND_STYLES, playBoardSound, stopBoardSounds, synthesizeBoardSound } from '../sound.js';
import type { BoardSound } from '../sound.js';

const kinds: BoardSound[] = ['move', 'capture', 'castle', 'promotion', 'check', 'mate'];

afterEach(() => {
  stopBoardSounds();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('board audio', () => {
  it('renders finite, unclipped samples with a quiet ending at common device sample rates', () => {
    for (const style of SOUND_STYLES) for (const rate of [44100, 48000]) {
      for (const kind of kinds) {
        const samples = synthesizeBoardSound(kind, rate, style.key);
        expect(samples.every(Number.isFinite)).toBe(true);
        expect(samples.some((sample) => Math.abs(sample) > 0.1)).toBe(true);
        expect(samples.every((sample) => Math.abs(sample) < 1)).toBe(true);
        expect(samples.slice(-100).every((sample) => Math.abs(sample) < 0.001)).toBe(true);
      }
    }
  });

  it('gives each preset a distinct sound for every board event', () => {
    for (const kind of kinds) {
      const sounds = SOUND_STYLES.map((style) => synthesizeBoardSound(kind, 44100, style.key));
      for (let a = 0; a < sounds.length; a++) {
        for (let b = a + 1; b < sounds.length; b++) expect(sounds[a]).not.toEqual(sounds[b]);
      }
    }
    expect(synthesizeBoardSound('move', 44100)).toEqual(synthesizeBoardSound('move', 44100, 'wooden'));
  });

  it('caches each style separately and applies the chosen volume during playback', () => {
    const started: { buffer: unknown; volume: number }[] = [];
    let level = 0;
    const audio = {
      state: 'running', sampleRate: 44100, destination: {},
      createBuffer: vi.fn((_channels: number, length: number) => {
        const data = new Float32Array(length);
        return { getChannelData: () => data };
      }),
      createGain: () => ({
        gain: { set value(value: number) { level = value; } },
        connect: vi.fn(), disconnect: vi.fn(),
      }),
      createBufferSource: () => ({
        buffer: null as unknown,
        connect: (gain: unknown) => gain,
        start() { started.push({ buffer: this.buffer, volume: level }); },
        stop: vi.fn(), disconnect: vi.fn(), onended: null,
      }),
    };
    vi.stubGlobal('window', { AudioContext: class { constructor() { return audio; } } });
    try {
      for (const style of SOUND_STYLES) playBoardSound('move', 0.5, style.key);
      playBoardSound('move', 0.25, 'wooden');
      expect(audio.createBuffer).toHaveBeenCalledTimes(4);
      expect(new Set(started.slice(0, 4).map((entry) => entry.buffer)).size).toBe(4);
      expect(started[4]!.buffer).toBe(started[0]!.buffer);
      expect(started[0]!.volume).toBe(0.4);
      expect(started[4]!.volume).toBe(0.2);
    } finally {
      audio.state = 'closed';
    }
  });

  it('gives castling two distinct impacts and each event a different sound', () => {
    const rate = 48000;
    const sounds = kinds.map((kind) => synthesizeBoardSound(kind, rate));
    for (let a = 0; a < sounds.length; a++) {
      for (let b = a + 1; b < sounds.length; b++) expect(sounds[a]).not.toEqual(sounds[b]);
    }
    const castle = synthesizeBoardSound('castle', rate);
    const peak = (from: number, to: number) => Math.max(...castle.slice(from * rate, to * rate).map(Math.abs));
    expect(peak(0.105, 0.12)).toBeGreaterThan(peak(0.08, 0.1) * 5);
  });

  it('does not create an audio device when muted or given an invalid volume', () => {
    const create = vi.fn();
    vi.stubGlobal('window', { AudioContext: create });
    playBoardSound('move', 0);
    playBoardSound('move', Number.NaN);
    expect(create).not.toHaveBeenCalled();
  });

  it('drops suspended sounds when muted or when resume resolves too late', async () => {
    let resume: () => void = () => {};
    const createBuffer = vi.fn();
    const audio = {
      state: 'suspended',
      resume: () => new Promise<void>((resolve) => { resume = resolve; }),
      createBuffer,
    };
    vi.stubGlobal('window', { AudioContext: class { constructor() { return audio; } } });
    playBoardSound('move', 0.5);
    stopBoardSounds();
    audio.state = 'running';
    resume();
    await Promise.resolve();
    expect(createBuffer).not.toHaveBeenCalled();

    audio.state = 'suspended';
    const now = vi.spyOn(Date, 'now').mockReturnValue(1000);
    playBoardSound('capture', 0.5);
    now.mockReturnValue(2000);
    audio.state = 'running';
    resume();
    await Promise.resolve();
    expect(createBuffer).not.toHaveBeenCalled();
    audio.state = 'closed';
  });
});
