export type BoardSound = 'move' | 'capture' | 'castle' | 'promotion' | 'check' | 'mate';

let context: AudioContext | null = null;
const buffers = new Map<BoardSound, AudioBuffer>();
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
export function synthesizeBoardSound(kind: BoardSound, sampleRate: number): Float32Array {
  const samples = new Float32Array(Math.ceil(sampleRate * 0.48));
  let seed = 173;
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 2147483648 - 1;
  };
  const tap = (offset: number, weight: number, pitch: number) => {
    const start = Math.round(offset * sampleRate);
    let low = 0;
    for (let i = 0; i < sampleRate * 0.16 && start + i < samples.length; i++) {
      const t = i / sampleRate;
      const attack = Math.min(1, t / 0.0008);
      const random = noise();
      low += 0.3 * (random - low);
      const contact = (random - low) * Math.exp(-t * 270) * 0.32;
      const body = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 65) * 0.4
        + Math.sin(2 * Math.PI * pitch * 2.71 * t) * Math.exp(-t * 100) * 0.2
        + Math.sin(2 * Math.PI * pitch * 4.13 * t) * Math.exp(-t * 150) * 0.09;
      samples[start + i]! += (body + contact) * weight * attack;
    }
  };
  const chime = (offset: number, pitch: number, weight: number) => {
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

export function playBoardSound(kind: BoardSound, volume: number): void {
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
      let buffer = buffers.get(kind);
      if (!buffer) {
        const data = synthesizeBoardSound(kind, audio.sampleRate);
        buffer = audio.createBuffer(1, data.length, audio.sampleRate);
        buffer.getChannelData(0).set(data);
        buffers.set(kind, buffer);
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
