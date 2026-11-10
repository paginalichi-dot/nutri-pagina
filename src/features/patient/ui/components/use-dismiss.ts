import { type RefObject, useEffect } from 'react';

type Options = { open: boolean; onClose: () => void; root: RefObject<HTMLElement | null>; trigger: RefObject<HTMLElement | null> };

export function useDismiss({ open, onClose, root, trigger }: Options): void {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      onClose();
      trigger.current?.focus();
    };
    const onOutside = (event: Event): void => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, [open, onClose, root, trigger]);
}
