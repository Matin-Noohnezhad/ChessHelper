/** Course shortcuts leave typing, dialogs and browser shortcuts alone. */
export function courseShortcutBlocked(event: KeyboardEvent): boolean {
  return event.defaultPrevented || event.repeat || event.isComposing ||
    event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
    Boolean(document.querySelector('[role="dialog"], dialog[open]')) ||
    (event.target instanceof HTMLElement && Boolean(event.target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], summary, a[href]',
    )));
}
