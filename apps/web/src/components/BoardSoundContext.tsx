import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SOUND_STYLE, prepareBoardSounds, stopBoardSounds, unlockBoardAudio } from '../sound.js';
import type { SoundStyle } from '../sound.js';

interface BoardSoundSettings {
  volume: number;
  style: SoundStyle;
  /** Sound moves replayed by stepping back and forward too, not just new ones. */
  replay: boolean;
}

export const BoardSoundContext = createContext<BoardSoundSettings>({ volume: 0.55, style: DEFAULT_SOUND_STYLE, replay: false });

export function BoardSoundProvider({ volume, style = DEFAULT_SOUND_STYLE, replay = false, children }: {
  volume: number; style?: SoundStyle; replay?: boolean; children: ReactNode;
}) {
  useEffect(() => {
    stopBoardSounds();
    if (volume <= 0) return;
    void prepareBoardSounds(style);
    const unlock = () => unlockBoardAudio();
    window.addEventListener('pointerdown', unlock, { capture: true });
    window.addEventListener('keydown', unlock, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
      stopBoardSounds();
    };
  }, [volume, style]);
  return <BoardSoundContext.Provider value={{ volume, style, replay }}>{children}</BoardSoundContext.Provider>;
}

export function useBoardSoundSettings(): BoardSoundSettings {
  return useContext(BoardSoundContext);
}
