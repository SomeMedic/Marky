import { useEffect } from 'react';

type HotkeyMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export const useHotkeys = (hotkeys: HotkeyMap) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = [
        e.metaKey || e.ctrlKey ? 'mod' : '',
        e.shiftKey ? 'shift' : '',
        e.altKey ? 'alt' : '',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      const callback = hotkeys[key];
      if (callback) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hotkeys]);
};