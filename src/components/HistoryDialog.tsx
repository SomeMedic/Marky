import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { History, Check, Plus, Minus } from 'lucide-react';
import { Fragment } from 'react';

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Array<{
    content: string;
    timestamp: number;
    isCurrent: boolean;
  }>;
  onSelectVersion: (index: number) => void;
}

const HistoryDialog: React.FC<HistoryDialogProps> = ({
  isOpen,
  onClose,
  entries,
  onSelectVersion
}) => {
  const getContentDiff = (currentContent: string, previousContent: string) => {
    const currentLines = currentContent.split('\n');
    const previousLines = previousContent.split('\n');
    
    // Находим первую измененную строку
    let changedLine = '';
    let changeType: 'added' | 'removed' | 'modified' = 'modified';
    
    if (currentContent === previousContent) {
      return { text: 'No changes', type: 'none' };
    }

    // Если это первая запись
    if (!previousContent) {
      const firstLine = currentLines[0] || '';
      return { 
        text: firstLine.slice(0, 100) + (firstLine.length > 100 ? '...' : ''),
        type: 'added' 
      };
    }

    // Ищем изменения
    for (let i = 0; i < Math.max(currentLines.length, previousLines.length); i++) {
      const currentLine = currentLines[i] || '';
      const previousLine = previousLines[i] || '';

      if (currentLine !== previousLine) {
        if (!previousLine) {
          changeType = 'added';
          changedLine = currentLine;
        } else if (!currentLine) {
          changeType = 'removed';
          changedLine = previousLine;
        } else {
          changeType = 'modified';
          changedLine = currentLine;
        }
        break;
      }
    }

    return {
      text: changedLine.slice(0, 100) + (changedLine.length > 100 ? '...' : ''),
      type: changeType
    };
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <History className="h-5 w-5" />
                  History
                </Dialog.Title>

                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  {entries.map((entry, index) => {
                    const diff = getContentDiff(
                      entry.content,
                      entries[index - 1]?.content || ''
                    );

                    return (
                      <button
                        key={entry.timestamp}
                        onClick={() => onSelectVersion(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          entry.isCurrent
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            entry.isCurrent 
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-700 dark:text-gray-200'
                          }`}>
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          {entry.isCurrent && <Check className="h-4 w-4" />}
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          {diff.type === 'added' && (
                            <Plus className="h-4 w-4 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                          )}
                          {diff.type === 'removed' && (
                            <Minus className="h-4 w-4 text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
                          )}
                          {diff.type === 'modified' && (
                            <History className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0" />
                          )}
                          <p className={`text-sm ${
                            diff.type === 'added' 
                              ? 'text-green-600 dark:text-green-300' 
                              : diff.type === 'removed'
                              ? 'text-red-600 dark:text-red-300'
                              : diff.type === 'modified'
                              ? 'text-yellow-600 dark:text-yellow-300'
                              : 'text-gray-600 dark:text-gray-200'
                          }`}>
                            {diff.text}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HistoryDialog; 