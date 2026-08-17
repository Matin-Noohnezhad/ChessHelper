import { useCallback, useMemo, useRef } from 'react';
import { usePrefs } from '../theme/prefs.js';

/**
 * Board sounds, synthesised rather than shipped.
 *
 * A wooden piece landing on a board is a short noise burst plus a low body
 * resonance, and that is cheap to build with an oscillator and a noise buffer.
 * Doing it this way keeps the app asset-free and makes the sounds themable
 * later (a "tournament clock" set is just different numbers).
 */

export type SoundName = 'move' | 'capture' | 'castle' | 'check' | 'promote' | 'illegal' | 'end';

interface AudioBits {
  ctx: AudioContext;
  noise: AudioBuffer;
}

function createNoise(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.25), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export interface Sounds {
  play: (name: SoundName) => void;
  /** Picks the sound that fits a SAN move and plays it. */
  playForSan: (san: string) => void;
}

export function useSounds(): Sounds {
  const { prefs } = usePrefs();
  const bits = useRef<AudioBits | null>(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  // The context is built on first use, which is always inside a click or a key
  // press — browsers refuse to start one any earlier.
  const audio = useCallback((): AudioBits | null => {
    if (typeof window === 'undefined') return null;
    if (!bits.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      bits.current = { ctx, noise: createNoise(ctx) };
    }
    if (bits.current.ctx.state === 'suspended') void bits.current.ctx.resume();
    return bits.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const current = prefsRef.current;
      if (!current.sound) return;
      const parts = audio();
      if (!parts) return;
      const { ctx, noise } = parts;
      const gain = current.soundVolume;
      const now = ctx.currentTime;

      /** The click of contact: filtered noise with a very fast decay. */
      const knock = (at: number, level: number, cutoff: number, decay: number) => {
        const src = ctx.createBufferSource();
        src.buffer = noise;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = cutoff;
        filter.Q.value = 0.8;
        const env = ctx.createGain();
        env.gain.setValueAtTime(level * gain, at);
        env.gain.exponentialRampToValueAtTime(0.0001, at + decay);
        src.connect(filter).connect(env).connect(ctx.destination);
        src.start(at);
        src.stop(at + decay + 0.02);
      };

      /** The body of the sound: a short pitched tone under the click. */
      const tone = (at: number, freq: number, level: number, decay: number, type: OscillatorType = 'sine') => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, at);
        const env = ctx.createGain();
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(level * gain, at + 0.005);
        env.gain.exponentialRampToValueAtTime(0.0001, at + decay);
        osc.connect(env).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + decay + 0.02);
      };

      switch (name) {
        case 'move':
          knock(now, 0.35, 1500, 0.05);
          tone(now, 190, 0.14, 0.09);
          break;
        case 'capture':
          knock(now, 0.5, 2400, 0.07);
          knock(now + 0.02, 0.35, 900, 0.09);
          tone(now, 130, 0.2, 0.13);
          break;
        case 'castle':
          knock(now, 0.3, 1500, 0.05);
          tone(now, 190, 0.12, 0.08);
          knock(now + 0.11, 0.3, 1500, 0.05);
          tone(now + 0.11, 190, 0.12, 0.08);
          break;
        case 'check':
          knock(now, 0.3, 1800, 0.05);
          tone(now, 880, 0.16, 0.1, 'triangle');
          tone(now + 0.1, 1320, 0.16, 0.14, 'triangle');
          break;
        case 'promote':
          tone(now, 660, 0.14, 0.12, 'triangle');
          tone(now + 0.09, 880, 0.14, 0.12, 'triangle');
          tone(now + 0.18, 1320, 0.16, 0.2, 'triangle');
          break;
        case 'illegal':
          tone(now, 120, 0.18, 0.14, 'square');
          break;
        case 'end':
          tone(now, 440, 0.16, 0.25, 'triangle');
          tone(now + 0.16, 330, 0.16, 0.4, 'triangle');
          break;
      }
    },
    [audio],
  );

  const playForSan = useCallback(
    (san: string) => {
      if (san.endsWith('#')) play('end');
      else if (san.includes('=')) play('promote');
      else if (san.endsWith('+')) play('check');
      else if (san.replace(/0/g, 'O').startsWith('O-O')) play('castle');
      else if (san.includes('x')) play('capture');
      else play('move');
    },
    [play],
  );

  return useMemo(() => ({ play, playForSan }), [play, playForSan]);
}
