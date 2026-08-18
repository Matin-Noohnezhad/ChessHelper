import { QUALITY_LABELS, QUALITY_SYMBOLS } from '@coh/review';
import type { MoveQuality } from '@coh/review';

/** One class per category, so the colour lives in the stylesheet and not in JS. */
export const qualityClass = (quality: MoveQuality) => `q q--${quality}`;

interface QualityBadgeProps {
  quality: MoveQuality;
  withLabel?: boolean;
}

export function QualityBadge({ quality, withLabel = false }: QualityBadgeProps) {
  return (
    <span className={`${qualityClass(quality)} quality-badge`} title={QUALITY_LABELS[quality]}>
      <span className="quality-badge__symbol">{QUALITY_SYMBOLS[quality]}</span>
      {withLabel && <span className="quality-badge__label">{QUALITY_LABELS[quality]}</span>}
    </span>
  );
}
