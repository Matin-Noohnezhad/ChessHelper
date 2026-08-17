import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrefs } from '../theme/prefs.js';
import { sanToSpeech } from '../lib/sanSpeech.js';

/**
 * Spoken move announcements through the browser's own synthesiser.
 *
 * No audio assets and no network: `speechSynthesis` already has the platform
 * voices installed. Everything is guarded for absence, because the API is
 * missing under server rendering and on a few mobile browsers.
 */

export interface Speech {
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  /** Announces a SAN move, if speech is switched on. */
  announce: (san: string) => void;
  /** Says an arbitrary phrase — opening names, status, the settings preview. */
  say: (text: string, force?: boolean) => void;
  cancel: () => void;
}

function synth(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  return 'speechSynthesis' in window ? window.speechSynthesis : null;
}

export function useSpeech(): Speech {
  const { prefs } = usePrefs();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const supported = useMemo(() => synth() !== null, []);

  // The voice list arrives asynchronously in Chrome, and is empty on the first
  // synchronous read — hence the event as well as the immediate call.
  useEffect(() => {
    const api = synth();
    if (!api) return;
    const read = () => setVoices(api.getVoices());
    read();
    api.addEventListener('voiceschanged', read);
    return () => api.removeEventListener('voiceschanged', read);
  }, []);

  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const voicesRef = useRef(voices);
  voicesRef.current = voices;

  const say = useCallback((text: string, force = false) => {
    const api = synth();
    const current = prefsRef.current;
    if (!api || (!current.speech && !force) || !text) return;

    // Announcements queue up otherwise, and a fast click through a game would
    // leave the voice minutes behind the board.
    api.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voicesRef.current.find((v) => v.voiceURI === current.speechVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = current.speechRate;
    utterance.volume = current.speechVolume;
    utterance.lang = voice?.lang ?? 'en-US';
    api.speak(utterance);
  }, []);

  const announce = useCallback(
    (san: string) => {
      say(sanToSpeech(san, { phonetic: prefsRef.current.speechPhonetic }));
    },
    [say],
  );

  const cancel = useCallback(() => synth()?.cancel(), []);

  // Leaving the page mid-sentence otherwise keeps talking in some browsers.
  useEffect(() => () => synth()?.cancel(), []);

  return useMemo(
    () => ({ supported, voices, announce, say, cancel }),
    [supported, voices, announce, say, cancel],
  );
}
