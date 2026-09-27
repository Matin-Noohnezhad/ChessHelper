import { afterEach, describe, expect, it, vi } from 'vitest';
import { playBoardSound, stopBoardSounds, synthesizeBoardSound } from '../sound.js';
import type { BoardSound } from '../sound.js';

const kinds: BoardSound[] = ['move', 'capture', 'castle', 'promotion', 'check', 'mate'];

afterEach(() => {
  stopBoardSounds();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('board audio', () => {
  it('renders finite, unclipped samples with a quiet ending at common device sample rates', () => {
    for (const rate of [44100, 48000]) {
      for (const kind of kinds) {
        const samples = synthesizeBoardSound(kind, rate);
        expect(samples.every(Number.isFinite)).toBe(true);
        expect(samples.some((sample) => Math.abs(sample) > 0.1)).toBe(true);
        expect(samples.every((sample) => Math.abs(sample) < 1)).toBe(true);
        expect(samples.slice(-100).every((sample) => Math.abs(sample) < 0.001)).toBe(true);
      }
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
