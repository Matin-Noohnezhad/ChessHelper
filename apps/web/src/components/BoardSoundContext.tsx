import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SOUND_STYLE, stopBoardSounds, unlockBoardAudio } from '../sound.js';
import type { SoundStyle } from '../sound.js';

export const BoardSoundContext = createContext({ volume: 0.55, style: DEFAULT_SOUND_STYLE });

export function BoardSoundProvider({ volume, style = DEFAULT_SOUND_STYLE, children }: {
  volume: number; style?: SoundStyle; children: ReactNode;
}) {
  useEffect(() => {
    stopBoardSounds();
    if (volume <= 0) return;
    const unlock = () => unlockBoardAudio();
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
      stopBoardSounds();
    };
  }, [volume, style]);
  return <BoardSoundContext.Provider value={{ volume, style }}>{children}</BoardSoundContext.Provider>;
}

export function useBoardSoundSettings(): { volume: number; style: SoundStyle } {
  return useContext(BoardSoundContext);
}
