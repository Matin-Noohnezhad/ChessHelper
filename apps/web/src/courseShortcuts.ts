/** Course shortcuts leave typing, dialogs and browser shortcuts alone. */
export function courseShortcutBlocked(event: KeyboardEvent): boolean {
  // Held arrows browse moves; repeating action keys could toggle modes or skip lessons.
  const repeatingAction = event.repeat && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight';
  return event.defaultPrevented || repeatingAction || event.isComposing ||
    // Space on a focused button should activate that button, not also advance the lesson.
    (event.key === ' ' && event.target instanceof HTMLElement && Boolean(event.target.closest('button, [role="button"]'))) ||
    event.ctrlKey || event.metaKey || event.altKey || event.shiftKey ||
    Boolean(document.querySelector('[role="dialog"], dialog[open]')) ||
    (event.target instanceof HTMLElement && Boolean(event.target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], summary, a[href]',
    )));
}
