import type { SectionHeader } from '@coh/course';

export function CourseSectionMapping({ value, onChange, disabled }: {
  value: SectionHeader;
  onChange: (header: SectionHeader) => void;
  disabled?: boolean;
}) {
  return (
    <label>
      <span>PGN section names</span>{' '}
      <select value={value} disabled={disabled}
        onChange={(event) => onChange(event.target.value as SectionHeader)}>
        <option value="White">White → sections, Black → subsections</option>
        <option value="Black">Black → sections, White → subsections</option>
      </select>
    </label>
  );
}
