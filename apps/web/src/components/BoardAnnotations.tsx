import { createContext, useId } from 'react';

export const ANNOTATION_STYLES = [
  { key: 'original', label: 'Original', description: 'Solid arrows and subtle square outlines.' },
  { key: 'chessbase', label: 'ChessBase', description: 'Fading arrow tails, broad arrowheads, and vivid rounded square outlines.' },
] as const;
export type AnnotationStyle = typeof ANNOTATION_STYLES[number]['key'];
export const AnnotationStyleContext = createContext<AnnotationStyle>('original');
export type DrawColor = 'green' | 'red' | 'blue' | 'yellow';
export const DRAW_COLOR_OPTIONS: { key: DrawColor; label: string }[] = [
  { key: 'green', label: 'Green' }, { key: 'red', label: 'Red' },
  { key: 'blue', label: 'Blue' }, { key: 'yellow', label: 'Yellow' },
];
export interface LastMoveArrowSettings {
  showLastMoveArrow: boolean;
  lastMoveArrowColor: DrawColor;
}
export const DEFAULT_LAST_MOVE_ARROW: LastMoveArrowSettings = {
  showLastMoveArrow: false, lastMoveArrowColor: 'blue',
};
export const LastMoveArrowContext = createContext(DEFAULT_LAST_MOVE_ARROW);
export type AnnotationThickness = 'thin' | 'medium' | 'thick' | 'extra';
export const ANNOTATION_THICKNESS_OPTIONS: { key: AnnotationThickness; label: string }[] = [
  { key: 'thin', label: 'Thin' },
  { key: 'medium', label: 'Medium' },
  { key: 'thick', label: 'Thick' },
  { key: 'extra', label: 'Extra thick' },
];

const ORIGINAL_COLORS: Record<DrawColor, string> = {
  green: 'rgba(21, 120, 27, 0.82)', red: 'rgba(200, 45, 45, 0.82)',
  blue: 'rgba(30, 100, 220, 0.82)', yellow: 'rgba(230, 158, 0, 0.85)',
};
const CHESSBASE_COLORS: Record<DrawColor, string> = {
  green: '#00c800', red: '#f00000', blue: '#204cff', yellow: '#ffe000',
};
const ORIGINAL_SCALE: Record<AnnotationThickness, { arrow: number; circle: number; marker: number }> = {
  thin: { arrow: 0.35, circle: 0.3, marker: 2.0 },
  medium: { arrow: 0.65, circle: 0.5, marker: 2.8 },
  thick: { arrow: 1.05, circle: 0.8, marker: 3.8 },
  extra: { arrow: 1.4, circle: 1.3, marker: 4.4 },
};
const CHESSBASE_SCALE: Record<AnnotationThickness, number> = { thin: 0.7, medium: 1, thick: 1.3, extra: 1.6 };
const SQUARE_SIZE = 12.5;
interface Point { x: number; y: number }
interface Appearance { style: AnnotationStyle; thickness: AnnotationThickness; color: DrawColor }

/** Native SVG recreation of the 2D appearance shown in ChessBase's annotation guide.
 * https://en.chessbase.com/post/annotating-in-chessbase-arrows-and-highlighted-squares
 * Dimensions are in board percentage units, so marks scale with every board.
 */
export function AnnotationArrow({ from, to, style, thickness, color }: Appearance & { from: Point; to: Point }) {
  const gradientId = `annotation-${useId().replace(/:/g, '')}`;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (!distance) return null;
  if (style === 'original') {
    const scale = ORIGINAL_SCALE[thickness];
    const ratio = Math.max(0, (distance - scale.marker) / distance);
    const end = { x: from.x + dx * ratio, y: from.y + dy * ratio };
    const nx = -dy / distance * scale.marker * 0.48;
    const ny = dx / distance * scale.marker * 0.48;
    return <g data-annotation-arrow={color} data-annotation-style={style} opacity="0.85">
      <line x1={from.x} y1={from.y} x2={end.x} y2={end.y}
        stroke={ORIGINAL_COLORS[color]} strokeWidth={scale.arrow} strokeLinecap="round" />
      <path d={`M${to.x},${to.y} L${end.x + nx},${end.y + ny} L${end.x - nx},${end.y - ny} Z`}
        fill={ORIGINAL_COLORS[color]} />
    </g>;
  }

  const scale = CHESSBASE_SCALE[thickness];
  // Leave the middle of the destination visible, especially when it holds a piece.
  const tip = { x: to.x - Math.sign(dx) * SQUARE_SIZE / 4, y: to.y - Math.sign(dy) * SQUARE_SIZE / 4 };
  const length = Math.hypot(tip.x - from.x, tip.y - from.y);
  const ux = (tip.x - from.x) / length;
  const uy = (tip.y - from.y) / length;
  const shaft = SQUARE_SIZE * 0.09 * scale;
  const head = Math.min(SQUARE_SIZE * 0.5 * scale, length * 0.72);
  const halfWidth = head * Math.tan(Math.PI / 8);
  const base = { x: tip.x - ux * head, y: tip.y - uy * head };
  const back = { x: tip.x - ux * head * 2 / 3, y: tip.y - uy * head * 2 / 3 };
  const shaftEnd = { x: tip.x - ux * head * 0.85, y: tip.y - uy * head * 0.85 };
  const ink = CHESSBASE_COLORS[color];
  return <g data-annotation-arrow={color} data-annotation-style={style}>
    <defs>
      <linearGradient id={gradientId} gradientUnits="userSpaceOnUse"
        x1={from.x} y1={from.y} x2={shaftEnd.x} y2={shaftEnd.y}>
        <stop offset="0" stopColor={ink} stopOpacity="0.15" />
        <stop offset="0.4" stopColor={ink} stopOpacity="0.4" />
        <stop offset="0.65" stopColor={ink} stopOpacity="0.55" />
        <stop offset="1" stopColor={ink} stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <line x1={from.x} y1={from.y} x2={shaftEnd.x} y2={shaftEnd.y}
      stroke={`url(#${gradientId})`} strokeWidth={shaft} strokeLinecap="round" />
    <path d={`M${base.x - uy * halfWidth},${base.y + ux * halfWidth} L${tip.x},${tip.y} L${base.x + uy * halfWidth},${base.y - ux * halfWidth} Q${back.x},${back.y} ${base.x - uy * halfWidth},${base.y + ux * halfWidth} Z`}
      fill={ink} fillOpacity="0.9" />
  </g>;
}

export function AnnotationSquare({ center, style, thickness, color }: Appearance & { center: Point }) {
  const chessbase = style === 'chessbase';
  const stroke = chessbase ? SQUARE_SIZE / 16 * CHESSBASE_SCALE[thickness] : ORIGINAL_SCALE[thickness].circle;
  const side = SQUARE_SIZE - stroke - (chessbase ? 0.15 : 0.8);
  const radius = chessbase ? side / 3.5 : 0.55;
  return <rect data-annotation-square={color} data-annotation-style={style}
    x={center.x - side / 2} y={center.y - side / 2} width={side} height={side}
    rx={radius} ry={radius} fill="none"
    stroke={chessbase ? CHESSBASE_COLORS[color] : ORIGINAL_COLORS[color]} strokeWidth={stroke} />;
}

export function AnnotationPreview({ style, thickness }: Pick<Appearance, 'style' | 'thickness'>) {
  return <svg className="annotation-preview" viewBox="0 0 100 37.5" role="img" aria-label="Arrow and square preview">
    <title>{`Preview of ${style === 'chessbase' ? 'ChessBase' : 'original'} arrows and square outlines`}</title>
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i % 8 * SQUARE_SIZE} y={Math.floor(i / 8) * SQUARE_SIZE}
      width={SQUARE_SIZE} height={SQUARE_SIZE} fill={(i % 8 + Math.floor(i / 8)) % 2 ? 'var(--sq-dark)' : 'var(--sq-light)'} />)}
    {(['green', 'red', 'blue', 'yellow'] as const).map((color, i) => <g key={color}>
      <AnnotationArrow from={{ x: i * 25 + 6.25, y: 31.25 }} to={{ x: i * 25 + 18.75, y: 6.25 }}
        style={style} thickness={thickness} color={color} />
      <AnnotationSquare center={{ x: i * 25 + 18.75, y: 6.25 }} style={style} thickness={thickness} color={color} />
    </g>)}
  </svg>;
}
