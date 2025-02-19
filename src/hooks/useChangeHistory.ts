import { useState, useEffect } from 'react';

interface HistoryEntry {
  content: string;
  timestamp: number;
}

export const useChangeHistory = (content: string) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [lastSavedContent, setLastSavedContent] = useState<string>('');

  // Загружаем историю при монтировании
  useEffect(() => {
    const savedHistory = localStorage.getItem('markdown-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as HistoryEntry[];
        setHistory(parsed);
        setCurrentIndex(parsed.length - 1);
        setLastSavedContent(parsed[parsed.length - 1]?.content || '');
      } catch (error) {
        console.error('Error parsing history:', error);
        localStorage.removeItem('markdown-history');
      }
    }
  }, []);

  // Сохраняем новую запись каждые 10 секунд, если есть изменения
  useEffect(() => {
    const interval = setInterval(() => {
      if (content !== lastSavedContent) {
        setHistory(prevHistory => {
          const newEntry = {
            content,
            timestamp: Date.now()
          };

          // Ограничиваем историю 50 записями
          const newHistory = [...prevHistory, newEntry].slice(-50);
          
          // Сохраняем в localStorage
          localStorage.setItem('markdown-history', JSON.stringify(newHistory));
          
          setCurrentIndex(newHistory.length - 1);
          setLastSavedContent(content);
          
          return newHistory;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [content, lastSavedContent]);

  // Сохраняем начальное состояние
  useEffect(() => {
    if (history.length === 0 && content) {
      const initialEntry = {
        content,
        timestamp: Date.now()
      };
      setHistory([initialEntry]);
      setCurrentIndex(0);
      setLastSavedContent(content);
      localStorage.setItem('markdown-history', JSON.stringify([initialEntry]));
    }
  }, [content, history.length]);

  const goToVersion = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      return history[index].content;
    }
    return null;
  };

  const getHistoryEntries = () => {
    return history.map((entry, index) => ({
      ...entry,
      isCurrent: index === currentIndex
    }));
  };

  return {
    goToVersion,
    getHistoryEntries,
    hasHistory: history.length > 0
  };
}; 