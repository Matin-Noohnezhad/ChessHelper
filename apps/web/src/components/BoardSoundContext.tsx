import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { stopBoardSounds, unlockBoardAudio } from '../sound.js';

export const BoardSoundContext = createContext(0.55);

export function BoardSoundProvider({ volume, children }: { volume: number; children: ReactNode }) {
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
  }, [volume]);
  return <BoardSoundContext.Provider value={volume}>{children}</BoardSoundContext.Provider>;
}

export function useBoardSoundVolume(): number {
  return useContext(BoardSoundContext);
}
