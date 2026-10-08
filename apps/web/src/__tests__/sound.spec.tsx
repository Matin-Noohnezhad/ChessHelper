import { afterEach, describe, expect, it, vi } from 'vitest';
import { SYNTHETIC_SOUND_STYLES, playBoardSound, stopBoardSounds, synthesizeBoardSound } from '../sound.js';
import type { BoardSound } from '../sound.js';

const kinds: BoardSound[] = ['move', 'capture', 'castle', 'promotion', 'check', 'mate'];

afterEach(() => {
  stopBoardSounds();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('board audio', () => {
  it('renders finite, unclipped samples with a quiet ending at common device sample rates', () => {
    for (const style of SYNTHETIC_SOUND_STYLES) for (const rate of [44100, 48000]) {
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
      const sounds = SYNTHETIC_SOUND_STYLES.map((style) => synthesizeBoardSound(kind, 44100, style.key));
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
      for (const style of SYNTHETIC_SOUND_STYLES) playBoardSound('move', 0.5, style.key);
      playBoardSound('move', 0.25, 'wooden');
      expect(audio.createBuffer).toHaveBeenCalledTimes(2);
      expect(new Set(started.slice(0, 2).map((entry) => entry.buffer)).size).toBe(2);
      expect(started[2]!.buffer).toBe(started[0]!.buffer);
      expect(started[0]!.volume).toBe(0.4);
      expect(started[2]!.volume).toBe(0.2);
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

describe('recorded board audio', () => {
  it('varies ChessBase impacts and preserves captures and castles on checking moves', async () => {
    const { boardSoundFiles } = await import('../sound.js');
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(boardSoundFiles('move', 'chessbase-recorded')).toEqual(['chessbase/board/move1.mp3']);
    expect(boardSoundFiles('capture', 'chessbase-recorded')).toEqual(['chessbase/board/capture1.mp3']);
    random.mockReturnValue(0.99999);
    expect(boardSoundFiles('move', 'chessbase-recorded')).toEqual(['chessbase/board/move11.mp3']);
    for (const kind of ['promotion', 'check', 'mate'] as const) {
      expect(boardSoundFiles(kind, 'chessbase-recorded')).toEqual(['chessbase/board/move11.mp3']);
      expect(boardSoundFiles(kind, 'chessbase-recorded', true)).toEqual(['chessbase/board/capture15.mp3']);
    }
    expect(boardSoundFiles('castle', 'chessbase-recorded')).toEqual(['chessbase/board/castle.mp3']);
    expect(boardSoundFiles('check', 'chessbase-recorded', false, true)).toEqual(['chessbase/board/castle.mp3']);
    expect(boardSoundFiles('mate', 'chessbase-recorded', false, true)).toEqual(['chessbase/board/castle.mp3']);
  });

  it('preloads every ChessBase variant once so a random capture plays from cache', async () => {
    const { prepareBoardSounds } = await import('../sound.js');
    const { audio, started } = recordedAudio();
    const fetch = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }));
    vi.stubGlobal('fetch', fetch);
    try {
      await Promise.all([prepareBoardSounds('chessbase-recorded'), prepareBoardSounds('chessbase-recorded')]);
      expect(fetch).toHaveBeenCalledTimes(27);
      const paths = fetch.mock.calls.map((args) => (args as unknown as [string])[0]);
      expect(paths).toContain('/sounds/chessbase/board/move11.mp3');
      expect(paths).toContain('/sounds/chessbase/board/capture15.mp3');
      expect(paths).toContain('/sounds/chessbase/board/castle.mp3');
      vi.spyOn(Math, 'random').mockReturnValue(0.99999);
      playBoardSound('check', 0.35, 'chessbase-recorded', true);
      await vi.waitFor(() => expect(started).toHaveLength(1));
      expect(started[0].volume).toBe(0.35);
      expect(fetch).toHaveBeenCalledTimes(27);
    } finally { audio.state = 'closed'; }
  });

  it('uses the original event recordings and preserves Lichess capture/check layering', async () => {
    const { boardSoundFiles } = await import('../sound.js');
    expect(boardSoundFiles('castle', 'chesscom')[0]).toMatch(/castle\.mp3$/);
    expect(boardSoundFiles('promotion', 'chesscom')[0]).toMatch(/promote\.mp3$/);
    expect(boardSoundFiles('check', 'lichess-lisp', true)).toEqual([
      'lichess/lisp/Capture.mp3', 'lichess/lisp/Check.mp3',
    ]);
    expect(boardSoundFiles('promotion', 'lichess', true)).toEqual(['lichess/standard/Capture.mp3']);
    expect(boardSoundFiles('castle', 'lichess')).toEqual(['lichess/standard/Move.mp3']);
  });

  it('preloads and caches recordings, uses the requested volume, and stops active playback', async () => {
    const { prepareBoardSounds } = await import('../sound.js');
    const { audio, started } = recordedAudio();
    const fetch = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }));
    vi.stubGlobal('fetch', fetch);
    try {
      await Promise.all([prepareBoardSounds('chesscom'), prepareBoardSounds('chesscom')]);
      expect(fetch).toHaveBeenCalledTimes(6);
      expect(audio.decodeAudioData).toHaveBeenCalledTimes(6);
      playBoardSound('move', 0.35, 'chesscom');
      await vi.waitFor(() => expect(started).toHaveLength(1));
      expect(started[0].volume).toBe(0.35);
      expect(fetch).toHaveBeenCalledTimes(6);
      stopBoardSounds();
      expect(started[0].stop).toHaveBeenCalledOnce();
    } finally { audio.state = 'closed'; }
  });

  it('discards recordings that finish loading after mute, style changes, or the freshness deadline', async () => {
    const { audio, started } = recordedAudio();
    let resolveFetch!: (value: unknown) => void;
    const fetch = vi.fn(() => new Promise((resolve) => { resolveFetch = resolve; }));
    vi.stubGlobal('fetch', fetch);
    const response = { ok: true, arrayBuffer: async () => new ArrayBuffer(8) };
    const now = vi.spyOn(Date, 'now').mockReturnValue(1000);
    try {
      playBoardSound('move', 0.5, 'chesscom');
      stopBoardSounds();
      resolveFetch(response);
      await vi.waitFor(() => expect(audio.decodeAudioData).toHaveBeenCalledOnce());
      expect(started).toHaveLength(0);
      playBoardSound('capture', 0.5, 'chesscom');
      now.mockReturnValue(1500);
      resolveFetch(response);
      await vi.waitFor(() => expect(audio.decodeAudioData).toHaveBeenCalledTimes(2));
      expect(started).toHaveLength(0);
    } finally { audio.state = 'closed'; }
  });

  it('allows retry after an asset fails to load without interrupting the board', async () => {
    const { prepareBoardSounds } = await import('../sound.js');
    const { audio, started } = recordedAudio();
    const fetch = vi.fn().mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
    vi.stubGlobal('fetch', fetch);
    try {
      await prepareBoardSounds('lichess');
      expect(started).toHaveLength(0);
      await prepareBoardSounds('lichess');
      expect(fetch).toHaveBeenCalledTimes(5);
      playBoardSound('move', 0.5, 'lichess');
      await vi.waitFor(() => expect(started).toHaveLength(1));
    } finally { audio.state = 'closed'; }
  });
});

function recordedAudio() {
  const started: { volume: number; stop: ReturnType<typeof vi.fn> }[] = [];
  let volume = 0;
  const audio = {
    state: 'running', destination: {},
    decodeAudioData: vi.fn(async () => ({ duration: 0.2 })),
    createGain: () => ({ gain: { set value(v: number) { volume = v; } }, connect: vi.fn(), disconnect: vi.fn() }),
    createBufferSource: () => ({
      buffer: null, onended: null, connect: (gain: unknown) => gain,
      start() { started.push({ volume, stop: this.stop }); }, stop: vi.fn(), disconnect: vi.fn(),
    }),
  };
  vi.stubGlobal('window', { AudioContext: class { constructor() { return audio; } } });
  return { audio, started };
}
