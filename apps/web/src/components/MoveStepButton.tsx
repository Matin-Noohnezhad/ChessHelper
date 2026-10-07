import { useEffect, useRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  onStep: () => void;
};

/** Step immediately, then repeat while the pointer remains pressed. */
export function MoveStepButton({ onStep, disabled, style, ...props }: Props) {
  const step = useRef(onStep);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointer = useRef<number | null>(null);

  function stop() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    pointer.current = null;
  }

  useEffect(() => {
    step.current = onStep;
    if (disabled) stop();
  }, [onStep, disabled]);

  useEffect(() => {
    const release = (event: PointerEvent) => {
      if (event.pointerId === pointer.current) stop();
    };
    const hide = () => {
      if (document.hidden) stop();
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', hide);
    return () => {
      stop();
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', hide);
    };
  }, []);

  return (
    <button
      {...props}
      type="button"
      disabled={disabled}
      style={{ ...style, touchAction: 'none', userSelect: 'none' }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0 || !event.isPrimary) return;
        stop();
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        onStep();
        const repeat = () => {
          if (pointer.current === null) return;
          step.current();
          timer.current = setTimeout(repeat, 100);
        };
        timer.current = setTimeout(repeat, 350);
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onBlur={stop}
      onContextMenu={(event) => event.preventDefault()}
      onClick={(event) => {
        // Pointer presses already stepped; retain keyboard/assistive clicks.
        if (event.detail === 0) onStep();
      }}
    />
  );
}
