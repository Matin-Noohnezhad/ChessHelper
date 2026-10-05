/** Course shortcuts leave typing, dialogs and browser shortcuts alone. */
export function courseShortcutBlocked(event: KeyboardEvent): boolean {
  return event.defaultPrevented || event.repeat || event.isComposing ||
    // Space on a focused button should activate that button, not also advance the lesson.
    (event.key === ' ' && event.target instanceof HTMLElement && Boolean(event.target.closest('button, [role="button"]'))) ||
    event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
    Boolean(document.querySelector('[role="dialog"], dialog[open]')) ||
    (event.target instanceof HTMLElement && Boolean(event.target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], summary, a[href]',
    )));
}
