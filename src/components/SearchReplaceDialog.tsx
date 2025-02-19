import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Replace, ArrowUp, ArrowDown, GripHorizontal } from 'lucide-react';

interface SearchReplaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onReplace: (newContent: string) => void;
}

const SearchReplaceDialog: React.FC<SearchReplaceDialogProps> = ({
  isOpen,
  onClose,
  content,
  onReplace,
}) => {
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [currentMatch, setCurrentMatch] = useState(-1);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.style.transform = 'translate(-50%, -50%)';
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchText) {
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(searchText, flags);
      const foundMatches: number[] = [];
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        foundMatches.push(match.index);
      }
      
      setMatches(foundMatches);
      setCurrentMatch(foundMatches.length > 0 ? 0 : -1);
    } else {
      setMatches([]);
      setCurrentMatch(-1);
    }
  }, [searchText, content, caseSensitive]);

  const handleReplaceCurrent = () => {
    if (currentMatch >= 0 && currentMatch < matches.length) {
      const before = content.slice(0, matches[currentMatch]);
      const after = content.slice(matches[currentMatch] + searchText.length);
      const newContent = before + replaceText + after;
      onReplace(newContent);
    }
  };

  const handleReplaceAll = () => {
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(searchText, flags);
    const newContent = content.replace(regex, replaceText);
    onReplace(newContent);
  };

  const highlightMatch = () => {
    if (searchText && matches.length > 0) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = matches[currentMatch];
        const end = start + searchText.length;
        
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const currentLine = textarea.value.substr(0, start).split('\n').length;
        const scrollPosition = lineHeight * (currentLine - 3);
        textarea.scrollTop = Math.max(0, scrollPosition);
        
        textarea.focus();
        textarea.setSelectionRange(start, end);
      }
    }
  };

  const navigateMatch = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return;
    
    if (direction === 'next') {
      setCurrentMatch((prev) => (prev + 1) % matches.length);
    } else {
      setCurrentMatch((prev) => (prev - 1 + matches.length) % matches.length);
    }
    
    setTimeout(() => {
      highlightMatch();
    }, 0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current) {
      isDragging.current = true;
      const rect = dialogRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      dialogRef.current.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current && dialogRef.current) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      const dialogRect = dialogRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - dialogRect.width;
      const maxY = window.innerHeight - dialogRect.height;
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      dialogRef.current.style.transform = `translate(${boundedX}px, ${boundedY}px)`;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-[100]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed  bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div
            ref={dialogRef}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              transform: 'translate(calc(50vw - 50%), calc(50vh - 50%))',
              width: 'calc(100% - 2rem)',
              maxWidth: '28rem',
              willChange: 'transform'
            }}
            className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
          >
            <div
              className="flex items-center justify-between px-6 py-3 bg-gray-100 dark:bg-gray-700 cursor-move"
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="w-4 h-4 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Search and Replace
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Search..."
                  />
                  <button
                    onClick={() => navigateMatch('prev')}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigateMatch('next')}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {matches.length > 0 ? `${currentMatch + 1} из ${matches.length}` : 'No matches'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Replace with
                </label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Replace with..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="caseSensitive"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-4 h-4 text-indigo-500 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:ring-2 dark:bg-gray-700 transition-colors duration-200"
                />
                <label htmlFor="caseSensitive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Register
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleReplaceCurrent}
                  disabled={matches.length === 0}
                  className="px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  Replace
                </button>
                <button
                  onClick={handleReplaceAll}
                  disabled={matches.length === 0}
                  className="px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
                >
                  Replace all
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SearchReplaceDialog;
