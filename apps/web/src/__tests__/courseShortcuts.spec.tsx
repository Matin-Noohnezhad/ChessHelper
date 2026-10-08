import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { courseShortcutBlocked } from '../courseShortcuts.js';

describe('held navigation keys', () => {
  beforeEach(() => {
    vi.stubGlobal('HTMLElement', class {});
    vi.stubGlobal('document', { querySelector: () => null });
  });
  afterEach(() => vi.unstubAllGlobals());

  const keyEvent = (key: string, overrides: Partial<KeyboardEvent> = {}) => ({
    key, repeat: true, ...overrides,
  }) as KeyboardEvent;

  it.each(['ArrowLeft', 'ArrowRight'])('allows repeated %s to browse moves', (key) => {
    expect(courseShortcutBlocked(keyEvent(key))).toBe(false);
  });

  it.each([' ', 'a', 'b', 't', 'r', 'p', 's', 'Escape'])('still blocks repeated action key %s', (key) => {
    expect(courseShortcutBlocked(keyEvent(key))).toBe(true);
    expect(courseShortcutBlocked(keyEvent(key, { repeat: false }))).toBe(false);
  });

  it.each(['ctrlKey', 'metaKey', 'altKey', 'shiftKey', 'isComposing', 'defaultPrevented'])(
    'respects %s even for held arrows', (flag) => {
      expect(courseShortcutBlocked(keyEvent('ArrowRight', { [flag]: true }))).toBe(true);
    },
  );

  it('blocks held arrows while a dialog is open', () => {
    vi.stubGlobal('document', { querySelector: () => ({}) });
    expect(courseShortcutBlocked(keyEvent('ArrowRight'))).toBe(true);
  });

  it('leaves held arrows in text fields alone', () => {
    class TextField {
      closest() { return this; }
    }
    vi.stubGlobal('HTMLElement', TextField);
    expect(courseShortcutBlocked(keyEvent('ArrowRight', { target: new TextField() as unknown as EventTarget }))).toBe(true);
  });
});
