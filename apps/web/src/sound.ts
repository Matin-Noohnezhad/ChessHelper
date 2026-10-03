export type BoardSound = 'move' | 'capture' | 'castle' | 'promotion' | 'check' | 'mate';

export const SOUND_STYLES = [
  { key: 'wooden', label: 'Wooden (original)', description: 'Warm wooden taps with soft chimes.' },
  { key: 'chessbase', label: 'ChessBase inspired', description: 'Dry, crisp clicks with a short board rattle.' },
  { key: 'chesscom', label: 'Chess.com inspired', description: 'Deep, rounded knocks with a punchy capture.' },
  { key: 'lichess', label: 'Lichess inspired', description: 'Light, bright ticks with a snappy capture.' },
] as const;
export type SoundStyle = typeof SOUND_STYLES[number]['key'];
export const DEFAULT_SOUND_STYLE: SoundStyle = 'wooden';

/** Original synthesis profiles, not recordings from the named applications. */
const PROFILES = {
  wooden: { pitch: 1, decay: 1, contact: 0.32, body: 1, filter: 0.3, harmonic: 2.71, rattle: 0, chime: 1 },
  chessbase: { pitch: 1.7, decay: 1.8, contact: 0.7, body: 0.5, filter: 0.12, harmonic: 3.4, rattle: 0.3, chime: 1.25 },
  chesscom: { pitch: 0.58, decay: 0.8, contact: 0.2, body: 1.3, filter: 0.55, harmonic: 2.2, rattle: 0.12, chime: 0.8 },
  lichess: { pitch: 2.3, decay: 2.3, contact: 0.42, body: 0.7, filter: 0.2, harmonic: 1.8, rattle: 0, chime: 1.5 },
} satisfies Record<SoundStyle, object>;

let context: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();
const playing = new Set<AudioBufferSourceNode>();
let revision = 0;

function getAudio(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!context || context.state === 'closed') {
    context = new window.AudioContext();
    buffers.clear();
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
export function synthesizeBoardSound(kind: BoardSound, sampleRate: number, style: SoundStyle = DEFAULT_SOUND_STYLE): Float32Array {
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

export function playBoardSound(kind: BoardSound, volume: number, style: SoundStyle = DEFAULT_SOUND_STYLE): void {
  if (!Number.isFinite(volume) || volume <= 0) return;
  try {
    const audio = getAudio();
    if (!audio) return;
    const requestedAt = Date.now();
    const requestedRevision = revision;
    const play = () => {
      // A blocked resume may resolve much later. Drop it instead of making a
      // burst of stale clicks when the user eventually interacts with the page.
      if (audio.state !== 'running' || revision !== requestedRevision || Date.now() - requestedAt > 250) return;
      const key = `${style}:${kind}`;
      let buffer = buffers.get(key);
      if (!buffer) {
        const data = synthesizeBoardSound(kind, audio.sampleRate, style);
        buffer = audio.createBuffer(1, data.length, audio.sampleRate);
        buffer.getChannelData(0).set(data);
        buffers.set(key, buffer);
      }
      const source = audio.createBufferSource();
      const gain = audio.createGain();
      source.buffer = buffer;
      gain.gain.value = Math.min(1, volume) * 0.8;
      source.connect(gain).connect(audio.destination);
      source.onended = () => {
        playing.delete(source);
        source.disconnect();
        gain.disconnect();
      };
      playing.add(source);
      source.start();
    };
    if (audio.state === 'running') play();
    else void audio.resume().then(play).catch(() => {});
  } catch {
    // Audio is optional; device or autoplay errors must never interrupt play.
  }
}
