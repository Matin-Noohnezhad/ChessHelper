import { RECORDED_SOUND_SETS } from './recordedSoundSets.js';

export type BoardSound = 'move' | 'capture' | 'castle' | 'promotion' | 'check' | 'mate';

export const SYNTHETIC_SOUND_STYLES = [
  { key: 'wooden', label: 'Wooden (original)', description: 'Warm wooden taps with soft chimes.' },
  { key: 'chessbase', label: 'ChessBase inspired', description: 'Original synthesized clicks with a short board rattle.' },
] as const;
export const SOUND_STYLES = [...SYNTHETIC_SOUND_STYLES, ...RECORDED_SOUND_SETS] as const;
export type SoundStyle = typeof SOUND_STYLES[number]['key'];
type SyntheticSoundStyle = typeof SYNTHETIC_SOUND_STYLES[number]['key'];
export const DEFAULT_SOUND_STYLE: SoundStyle = 'wooden';

const PROFILES = {
  wooden: { pitch: 1, decay: 1, contact: 0.32, body: 1, filter: 0.3, harmonic: 2.71, rattle: 0, chime: 1 },
  chessbase: { pitch: 1.7, decay: 1.8, contact: 0.7, body: 0.5, filter: 0.12, harmonic: 3.4, rattle: 0.3, chime: 1.25 },
} satisfies Record<SyntheticSoundStyle, object>;

let context: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();
const pendingBuffers = new Map<string, Promise<AudioBuffer>>();
const playing = new Set<AudioBufferSourceNode>();
let revision = 0;

function getAudio(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!context || context.state === 'closed') {
    context = new window.AudioContext();
    buffers.clear();
    pendingBuffers.clear();
  }
  return context;
}

/** Called within a user gesture, before a delayed trainer move needs the audio. */
export function unlockBoardAudio(): void {
  try {
    const audio = getAudio();
    if (audio && audio.state !== 'running') void audio.resume().catch(() => {});
  } catch {
    // A browser without audio should still be a fully working chessboard.
  }
}

/** Also invalidates pending resume callbacks, so unmuting never replays old moves. */
export function stopBoardSounds(): void {
  revision++;
  for (const source of playing) {
    try { source.stop(); } catch { /* already ended */ }
  }
  playing.clear();
}

/**
 * Render a little wooden impact once and cache it. Damped, inharmonic resonances
 * and a filtered contact transient give a piece-on-board sound without a pitched
 * electronic sweep. No downloads, codecs, or network delay during a move.
 */
export function synthesizeBoardSound(kind: BoardSound, sampleRate: number, style: SyntheticSoundStyle = 'wooden'): Float32Array {
  const profile = PROFILES[style];
  const samples = new Float32Array(Math.ceil(sampleRate * 0.48));
  let seed = 173;
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 2147483648 - 1;
  };
  const tap = (offset: number, weight: number, pitch: number) => {
    pitch *= profile.pitch;
    const start = Math.round(offset * sampleRate);
    let low = 0;
    for (let i = 0; i < sampleRate * 0.16 && start + i < samples.length; i++) {
      const t = i / sampleRate;
      const attack = Math.min(1, t / 0.0008);
      const random = noise();
      low += profile.filter * (random - low);
      const contact = (random - low) * Math.exp(-t * 270 * profile.decay) * profile.contact;
      const body = profile.body * (
        Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 65 * profile.decay) * 0.4
        + Math.sin(2 * Math.PI * pitch * profile.harmonic * t) * Math.exp(-t * 100 * profile.decay) * 0.2
        + Math.sin(2 * Math.PI * pitch * 4.13 * t) * Math.exp(-t * 150 * profile.decay) * 0.09);
      samples[start + i]! += (body + contact) * weight * attack;
    }
  };
  const chime = (offset: number, pitch: number, weight: number) => {
    pitch *= profile.chime;
    const start = Math.round(offset * sampleRate);
    for (let i = 0; i < sampleRate * 0.25 && start + i < samples.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.min(1, t / 0.008) * Math.exp(-t * 24) * Math.max(0, 1 - t / 0.25);
      samples[start + i]! += Math.sin(2 * Math.PI * pitch * t) * envelope * weight;
    }
  };

  if (kind === 'capture') {
    tap(0, 0.55, 620);
    tap(0.035, 1, 340);
  } else if (kind === 'castle') {
    tap(0, 0.8, 470);
    tap(0.105, 0.85, 390);
  } else {
    tap(0, 0.85, 460);
  }
  if (profile.rattle) tap(0.018, profile.rattle, 710);
  if (kind === 'check') chime(0.045, 880, 0.13);
  if (kind === 'promotion') {
    chime(0.055, 660, 0.11);
    chime(0.15, 990, 0.1);
  }
  if (kind === 'mate') {
    chime(0.06, 660, 0.13);
    chime(0.19, 440, 0.13);
  }
  return samples;
}

/** Preserve each site's event mapping, including layering and random variants. */
export function boardSoundFiles(kind: BoardSound, style: SoundStyle, capture = false, castle = false): string[] {
  const set = RECORDED_SOUND_SETS.find((item) => item.key === style);
  if (!set) return [];
  if (set.source === 'ChessBase') {
    // ChessBase presets use the underlying move rather than a separate chime.
    // Keep capture/castling information when a higher-priority event masks it.
    const files = set.sounds[capture || kind === 'capture' ? 'capture'
      : castle || kind === 'castle' ? 'castle' : 'move'];
    return [typeof files === 'string' ? files : files[Math.floor(Math.random() * files.length)]!];
  }
  const file = set.sounds[kind];
  if (set.source === 'Lichess') {
    const base = set.sounds[capture || kind === 'capture' ? 'capture' : 'move'];
    return kind === 'check' || kind === 'mate' ? [base, file] : [base];
  }
  return [file];
}

function loadRecording(audio: AudioContext, file: string): Promise<AudioBuffer> {
  const cached = buffers.get(file);
  if (cached) return Promise.resolve(cached);
  const pending = pendingBuffers.get(file);
  if (pending) return pending;
  const request = fetch(`${import.meta.env.BASE_URL}sounds/${file}`)
    .then((response) => {
      if (!response.ok) throw new Error(`Sound download failed: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => audio.decodeAudioData(data))
    .then((buffer) => {
      if (context === audio) buffers.set(file, buffer);
      return buffer;
    })
    .finally(() => {
      if (pendingBuffers.get(file) === request) pendingBuffers.delete(file);
    });
  pendingBuffers.set(file, request);
  return request;
}

/** Load only the selected set, ahead of the first move or preview. */
export async function prepareBoardSounds(style: SoundStyle): Promise<void> {
  const set = RECORDED_SOUND_SETS.find((item) => item.key === style);
  if (!set) return;
  try {
    const audio = getAudio();
    if (audio) await Promise.allSettled([...new Set(Object.values(set.sounds).flat())].map((file) => loadRecording(audio, file)));
  } catch {
    // Audio/device failures must not prevent a board from rendering.
  }
}

export function playBoardSound(kind: BoardSound, volume: number, style: SoundStyle = DEFAULT_SOUND_STYLE, capture = false, castle = false): void {
  if (!Number.isFinite(volume) || volume <= 0) return;
  try {
    const audio = getAudio();
    if (!audio) return;
    const requestedAt = Date.now();
    const requestedRevision = revision;
    const isCurrent = () => audio.state === 'running' && revision === requestedRevision && Date.now() - requestedAt <= 250;
    const playBuffer = (buffer: AudioBuffer, recorded: boolean) => {
      // Discard delayed downloads/resumes after mute, a style change, or navigation.
      if (!isCurrent()) return;
      const source = audio.createBufferSource();
      const gain = audio.createGain();
      source.buffer = buffer;
      gain.gain.value = Math.min(1, volume) * (recorded ? 1 : 0.8);
      source.connect(gain).connect(audio.destination);
      source.onended = () => {
        playing.delete(source);
        source.disconnect();
        gain.disconnect();
      };
      playing.add(source);
      source.start();
    };
    const files = boardSoundFiles(kind, style, capture, castle);
    if (files.length) {
      const ready = audio.state === 'running' ? Promise.resolve() : audio.resume();
      void Promise.all([ready, Promise.all(files.map((file) => loadRecording(audio, file)))])
        .then(([, loaded]) => loaded.forEach((buffer) => playBuffer(buffer, true)))
        .catch(() => {});
    } else {
      const play = () => {
        if (!isCurrent()) return;
        const key = `${style}:${kind}`;
        let buffer = buffers.get(key);
        if (!buffer) {
          const data = synthesizeBoardSound(kind, audio.sampleRate, style as SyntheticSoundStyle);
          buffer = audio.createBuffer(1, data.length, audio.sampleRate);
          buffer.getChannelData(0).set(data);
          buffers.set(key, buffer);
        }
        playBuffer(buffer, false);
      };
      if (audio.state === 'running') play();
      else void audio.resume().then(play).catch(() => {});
    }
  } catch {
    // Audio is optional; device or autoplay errors must never interrupt play.
  }
}
