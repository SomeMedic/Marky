import { useEffect } from 'react';

export const useAutosave = (content: string, callback: (savedContent: string) => void) => {
  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem('markdown-content');
    if (saved) callback(saved);
  }, []);

  // Save content on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('markdown-content', content);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content]);
};