import type { CSSProperties } from 'react';

// Original ChessBase preset colors and texture pairs; provenance in public/boards/chessbase/README.md.
export const BOARD_THEMES = [
  { key: 'walnut', label: 'Walnut', group: 'Original', light: '#f0dfc2', dark: '#ae8662', coordinate: '#624830' },
  { key: 'tournament', label: 'Tournament', group: 'Original', light: '#e8edda', dark: '#79956e', coordinate: '#405737' },
  { key: 'slate', label: 'Slate', group: 'Original', light: '#e1e7eb', dark: '#7c96a8', coordinate: '#384f61' },
  { key: 'chessbase-fritz5', label: 'Fritz5', group: 'ChessBase colors', light: '#e7d0a7', dark: '#a77e5c' },
  { key: 'chessbase-junior5', label: 'Junior5', group: 'ChessBase colors', light: '#a7bae7', dark: '#5969aa' },
  { key: 'chessbase-nimzo', label: 'Nimzo', group: 'ChessBase colors', light: '#eebbbb', dark: '#af6a65' },
  { key: 'chessbase-hiarcs', label: 'Hiarcs', group: 'ChessBase colors', light: '#e6e0c6', dark: '#49a049' },
  { key: 'chessbase-fritz4', label: 'Fritz4', group: 'ChessBase colors', light: '#e7d0a7', dark: '#a77e5c' },
  { key: 'chessbase-grey', label: 'Grey', group: 'ChessBase colors', light: '#dfdfdf', dark: '#808080' },
  { key: 'chessbase-petrol', label: 'Petrol', group: 'ChessBase colors', light: 'hsl(180 30% 92%)', dark: 'hsl(180 30% 47%)' },
  { key: 'chessbase-maple', label: 'Maple', group: 'ChessBase textures', light: '#efd4b0', dark: '#c16736', lightTexture: 'figured', darkTexture: 'maple', frame: 'carmine' },
  { key: 'chessbase-teak', label: 'Teak', group: 'ChessBase textures', light: '#efd4b0', dark: '#9b654e', lightTexture: 'figured', darkTexture: 'worn', frame: 'carmine' },
  { key: 'chessbase-cherry', label: 'Cherry', group: 'ChessBase textures', light: '#ebd8b9', dark: '#b86639', lightTexture: 'big-butter', darkTexture: 'cherry', frame: 'carmine' },
  { key: 'chessbase-babinga', label: 'Babinga', group: 'ChessBase textures', light: '#ebd8b9', dark: '#b16840', lightTexture: 'big-butter', darkTexture: 'babinga', frame: 'teak' },
  { key: 'chessbase-pine', label: 'Pine', group: 'ChessBase textures', light: '#efd4b0', dark: '#a06a58', lightTexture: 'figured', darkTexture: 'pine', frame: 'teak' },
  { key: 'chessbase-worn', label: 'Worn', group: 'ChessBase textures', light: '#efd4b0', dark: '#9b654e', lightTexture: 'figured', darkTexture: 'worn', frame: 'teak' },
  { key: 'chessbase-green-marble', label: 'Green Marble', group: 'ChessBase textures', light: '#dfdde0', dark: '#427c3d', lightTexture: 'gray-marble', darkTexture: 'turk-marble', frame: 'white-marble' },
  { key: 'chessbase-brown-marble', label: 'Brown Marble', group: 'ChessBase textures', light: '#eedabc', dark: '#987257', lightTexture: 'beige-marble', darkTexture: 'pink-marble', frame: 'white-marble' },
  { key: 'chessbase-metal', label: 'Metal', group: 'ChessBase textures', light: '#bcc1c5', dark: '#656b70', lightTexture: 'metal-windows', darkTexture: 'medium-metal', frame: 'black-metal' },
  { key: 'chessbase-grass', label: 'Grass', group: 'ChessBase textures', light: '#ebd8b9', dark: '#b86639', lightTexture: 'big-butter', darkTexture: 'cherry', frame: 'grass' },
] as const;

export type BoardTheme = typeof BOARD_THEMES[number]['key'];
export const BOARD_THEME_GROUPS = ['Original', 'ChessBase colors', 'ChessBase textures'] as const;

const texture = (name: string) => `url("/boards/chessbase/${name}.png")`;

export function boardThemeStyle(key: BoardTheme): CSSProperties {
  const theme = BOARD_THEMES.find((candidate) => candidate.key === key) ?? BOARD_THEMES[0];
  return {
    '--sq-light': theme.light,
    '--sq-dark': theme.dark,
    '--sq-light-image': 'lightTexture' in theme ? texture(theme.lightTexture) : 'none',
    '--sq-dark-image': 'darkTexture' in theme ? texture(theme.darkTexture) : 'none',
    '--board-frame-image': 'frame' in theme ? texture(theme.frame) : 'none',
    '--coord-light': 'coordinate' in theme ? theme.coordinate : '#302820',
  } as CSSProperties;
}
