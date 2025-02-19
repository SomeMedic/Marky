import React, { useRef, useCallback, useReducer, useEffect, useState, Fragment } from 'react';
import { Bold, Italic, Link, List, ListOrdered, Code, Quote, Maximize2, Minimize2, Image, GitBranch, History, Search } from 'lucide-react';
import { useHotkeys } from '../hooks/useHotkeys';
import { Table, CheckSquare, Table2 } from 'lucide-react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { Check } from 'lucide-react';
import ImageUploadDialog from './ImageUploadDialog';
import { useChangeHistory } from '../hooks/useChangeHistory';
import HistoryDialog from './HistoryDialog';
import SearchReplaceDialog from './SearchReplaceDialog';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  syncScroll?: boolean;
}

interface EditorState {
  currentValue: string;
  undoStack: string[];
  redoStack: string[];
}

type EditorAction =
  | { type: 'SET_VALUE'; value: string }
  | { type: 'UNDO' }
  | { type: 'REDO' };

  interface LanguageOption {
    name: string;
    value: string;
    icon?: string;
  }
  
  const languages: LanguageOption[] = [
    { name: 'JavaScript', value: 'javascript', icon: 'js' },
    { name: 'TypeScript', value: 'typescript', icon: 'ts' },
    { name: 'Python', value: 'python', icon: 'py' },
    { name: 'Java', value: 'java', icon: 'java' },
    { name: 'C++', value: 'cpp', icon: 'cpp' },
    { name: 'HTML', value: 'html', icon: 'html' },
    { name: 'CSS', value: 'css', icon: 'css' },
    { name: 'Ruby', value: 'ruby', icon: 'rb' },
    { name: 'Go', value: 'go', icon: 'go' },
    { name: 'Rust', value: 'rust', icon: 'rs' },
    { name: 'PHP', value: 'php', icon: 'php' },
    { name: 'Swift', value: 'swift', icon: 'swift' },
    { name: 'Kotlin', value: 'kotlin', icon: 'kt' },
    { name: 'Shell', value: 'shell', icon: 'sh' },
    { name: 'SQL', value: 'sql', icon: 'sql' },
    { name: 'YAML', value: 'yaml', icon: 'yml' },
    { name: 'C#', value: 'csharp', icon: 'cs' },
    { name: 'C', value: 'c', icon: 'c' },
    { name: 'Objective-C', value: 'objectivec', icon: 'm' },
    { name: 'Scala', value: 'scala', icon: 'scala' },
    { name: 'Perl', value: 'perl', icon: 'pl' },
    { name: 'Lua', value: 'lua', icon: 'lua' },
    { name: 'MATLAB', value: 'matlab', icon: 'matlab' },
    { name: 'Haskell', value: 'haskell', icon: 'hs' },
    { name: 'Groovy', value: 'groovy', icon: 'groovy' },
    { name: 'Visual Basic', value: 'visualbasic', icon: 'vb' },
    { name: 'Cobol', value: 'cobol', icon: 'cbl' },
    { name: 'F#', value: 'fsharp', icon: 'fs' },
    { name: 'Assembly', value: 'assembly', icon: 'asm' },
    { name: 'Delphi', value: 'delphi', icon: 'pas' },
    { name: 'Fortran', value: 'fortran', icon: 'f' },
    { name: 'Ada', value: 'ada', icon: 'ada' },
    { name: 'Erlang', value: 'erlang', icon: 'erl' },
    { name: 'R', value: 'r', icon: 'r' },
    { name: 'Dart', value: 'dart', icon: 'dart' },
    { name: 'JSON', value: 'json', icon: 'json' }, 
    { name: 'Markdown', value: 'markdown', icon: 'md' },
    { name: 'Dockerfile', value: 'dockerfile', icon: 'docker' },
    { name: 'PowerShell', value: 'powershell', icon: 'ps1' },
    { name: 'Batch', value: 'batch', icon: 'bat' },
    { name: 'ABAP', value: 'abap', icon: 'abap' },
    { name: 'Apex', value: 'apex', icon: 'cls' },
    { name: 'APL', value: 'apl', icon: 'apl' },
    { name: 'Clojure', value: 'clojure', icon: 'clj' },
    { name: 'CoffeeScript', value: 'coffeescript', icon: 'coffee' },
    { name: 'Crystal', value: 'crystal', icon: 'cr' },
    { name: 'Elixir', value: 'elixir', icon: 'ex' },
    { name: 'Elm', value: 'elm', icon: 'elm' },
    { name: 'F#', value: 'fsharp', icon: 'fs' },
    { name: 'GraphQL', value: 'graphql', icon: 'graphql' },
    { name: 'HCL', value: 'hcl', icon: 'hcl' },
    { name: 'Julia', value: 'julia', icon: 'jl' },
    { name: 'Less', value: 'less', icon: 'less' },
    { name: 'Lisp', value: 'lisp', icon: 'lisp' },
    { name: 'LiveScript', value: 'livescript', icon: 'ls' },
    { name: 'Makefile', value: 'makefile', icon: 'mk' },
    { name: 'Nim', value: 'nim', icon: 'nim' },
    { name: 'Objective-C++', value: 'objectivecpp', icon: 'mm' },
    { name: 'Pascal', value: 'pascal', icon: 'pas' },
    { name: 'Prolog', value: 'prolog', icon: 'pro' },
    { name: 'Puppet', value: 'puppet', icon: 'pp' },
    { name: 'Raku', value: 'raku', icon: 'raku' },
    { name: 'Reason', value: 'reason', icon: 're' },
    { name: 'Sass', value: 'sass', icon: 'sass' },
    { name: 'Scheme', value: 'scheme', icon: 'scm' },
    { name: 'Smalltalk', value: 'smalltalk', icon: 'st' },
    { name: 'Solidity', value: 'solidity', icon: 'sol' },
    { name: 'Stylus', value: 'stylus', icon: 'styl' },
    { name: 'TCL', value: 'tcl', icon: 'tcl' },
    { name: 'TeX', value: 'tex', icon: 'tex' },
    { name: 'TOML', value: 'toml', icon: 'toml' },
    { name: 'VHDL', value: 'vhdl', icon: 'vhdl' },
    { name: 'Verilog', value: 'verilog', icon: 'v' },
    { name: 'XML', value: 'xml', icon: 'xml' },
  ];
  

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        currentValue: action.value,
        undoStack: [state.currentValue, ...state.undoStack],
        redoStack: []
      };
    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const [prevValue, ...newUndoStack] = state.undoStack;
      return {
        currentValue: prevValue,
        undoStack: newUndoStack,
        redoStack: [state.currentValue, ...state.redoStack]
      };
    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const [nextValue, ...newRedoStack] = state.redoStack;
      return {
        currentValue: nextValue,
        undoStack: [state.currentValue, ...state.undoStack],
        redoStack: newRedoStack
      };
    default:
      return state;
  }
};

const Editor: React.FC<EditorProps> = ({ value, onChange, syncScroll }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [state, dispatch] = useReducer(editorReducer, {
    currentValue: value,
    undoStack: [],
    redoStack: []
  });

  useEffect(() => {
    if (value !== state.currentValue) {
      dispatch({ type: 'SET_VALUE', value });
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = languages.filter(lang =>
  lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUndo = useCallback(() => {
    if (state.undoStack.length > 0) {
      dispatch({ type: 'UNDO' });
      const newValue = state.undoStack[0] || state.currentValue;
      onChange(newValue);
    }
  }, [state.undoStack, state.currentValue, onChange]);

  const handleRedo = useCallback(() => {
    if (state.redoStack.length > 0) {
      dispatch({ type: 'REDO' });
      const newValue = state.redoStack[0] || state.currentValue;
      onChange(newValue);
    }
  }, [state.redoStack, state.currentValue, onChange]);

  useHotkeys({
    // Существующие горячие клавиши
    'mod+b': () => insertMarkdown('**', '**'),
    'mod+i': () => insertMarkdown('*', '*'),
    'mod+k': () => insertMarkdown('[', '](url)'),
    'mod+l': () => insertMarkdown('- '),
    'mod+shift+l': () => insertMarkdown('1. '),
    'mod+shift+c': () => insertMarkdown('```\n', '\n```'),
    'mod+shift+.': () => insertMarkdown('> '),
    'mod+enter': () => setIsFullscreen(prev => !prev),
    'mod+z': handleUndo,
    'mod+y': handleRedo,
    'mod+shift+z': handleRedo, // Альтернативная комбинация для Redo
    'mod+shift+i': () => setIsImageDialogOpen(true),
    'mod+alt+f': (e) => {
      e.preventDefault();
      setIsSearchDialogOpen(true);
    },
  });

  const insertMarkdown = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  }, [value, onChange]);

  const insertTable = useCallback(() => {
    insertMarkdown(`
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`);
  }, [insertMarkdown]);
  
  const insertTaskList = useCallback(() => {
    insertMarkdown(`
- [ ] Task 1
- [ ] Task 2
- [x] Completed task
`);
  }, [insertMarkdown]);

  // Keyboard shortcuts


  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const insertCodeBlock = (language: string) => {
    insertMarkdown(`\`\`\`${language}\n`, '\n\`\`\`');
  };

  // Добавляем обработчик скролла
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!syncScroll) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('editor-scroll', { 
      detail: { scrollPercentage } 
    }));
  }, [syncScroll]);

  // Добавляем слушатель события скролла от Preview
  useEffect(() => {
    if (!syncScroll) return;

    const handlePreviewScroll = (e: Event) => {
      const { scrollPercentage } = (e as CustomEvent).detail;
      const textarea = textareaRef.current;
      
      if (textarea) {
        const scrollHeight = textarea.scrollHeight - textarea.clientHeight;
        textarea.scrollTop = scrollHeight * scrollPercentage;
      }
    };

    window.addEventListener('preview-scroll', handlePreviewScroll);
    return () => window.removeEventListener('preview-scroll', handlePreviewScroll);
  }, [syncScroll]);

  const handleCursorPosition = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorIndex);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length;
    const currentColumn = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line: currentLine, column: currentColumn });
  };

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleImageInsert = useCallback((markdown: string) => {
    insertMarkdown(markdown);
  }, [insertMarkdown]);

  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const { goToVersion, getHistoryEntries, hasHistory } = useChangeHistory(value);

  const handleVersionSelect = (index: number) => {
    const newContent = goToVersion(index);
    if (newContent) {
      onChange(newContent);
      setIsHistoryDialogOpen(false);
    }
  };

  interface TooltipProps {
    children: React.ReactNode;
    content: string;
  }

  const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
    return (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      </div>
    );
  }

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchHighlights, setSearchHighlights] = useState<{
    matches: number[];
    current: number;
  } | null>(null);

  const handleSearch = (matches: number[], currentMatch: number) => {
    setSearchHighlights({ matches, current: currentMatch });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between transition-colors duration-200">
          <div className="flex gap-2">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Bold (⌘+B)"
            >
              <Bold size={15} />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Italic (⌘+I)"
            >
              <Italic size={15} />
            </button>
            <button
              onClick={() => insertMarkdown('[', '](url)')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Link (⌘+K)"
            >
              <Link size={15} />
            </button>
            <button
              onClick={() => insertMarkdown('- ')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Unordered List (⌘+L)"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => insertMarkdown('1. ')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Ordered List (⌘+Shift+L)"
            >
              <ListOrdered size={15} />
            </button>
            <button
              onClick={() => setIsImageDialogOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Insert Image (⌘+Shift+I)"
            >
              <Image size={15} />
            </button>
            <div className="relative group">
              <button
                onClick={() => setIsLanguageDialogOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Code Block (⌘+Shift+C)"
              >
                <Code size={15} />
              </button>
              <Transition appear show={isLanguageDialogOpen} as={Fragment}>
                <Dialog 
                  as="div" 
                  className="relative z-50"
                  onClose={() => setIsLanguageDialogOpen(false)}
                >
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
                          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                            Select Language
                          </Dialog.Title>

                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                              placeholder="Search language..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                            {filteredLanguages.map((lang) => (
                              <button
                                key={lang.value}
                                onClick={() => {
                                  insertCodeBlock(lang.value);
                                  setIsLanguageDialogOpen(false);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 group"
                              >
                                {lang.icon && (
                                  <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                                    {lang.icon}
                                  </span>
                                )}
                                <span>{lang.name}</span>
                              </button>
                            ))}
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            </div>
            <button
              onClick={() => insertMarkdown('> ')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Quote (⌘+Shift+.)"
            >
              <Quote size={15} />
            </button>
            
            <button
              onClick={insertTable}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Insert Table"
              >
                <Table2 size={15} />
              </button>
              <button
                onClick={insertTaskList}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Insert Task List"
              >
                <CheckSquare size={15} />
              </button>
            
          </div>
          <div className="flex items-center gap-2">

          <button
              onClick={() => setIsSearchDialogOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Search and Replace (⌘+R)"
            >
              <Search size={15} />
            </button>
            <button
              onClick={() => setIsHistoryDialogOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
              title="View History"
            >
              <History size={15} />
            </button>
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all ease-in-out duration-300"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onClick={handleCursorPosition}
          onKeyUp={handleCursorPosition}
          className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono transition-colors duration-200"
          placeholder="Type your beautiful markdown here..."
        />
         <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between transition-colors duration-200">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono flex gap-2">
            [{new Blob([value]).size} bytes] • [{wordCount} words] • [{charCount} characters]
          </div>
        </div>
        <ImageUploadDialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          onInsert={handleImageInsert}
        />
      </div>

      <Transition appear show={isFullscreen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50"
          onClose={() => setIsFullscreen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[90vw] h-[90vh] transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl transition-all flex flex-col">
                  <div className="flex flex-col h-full">
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between transition-colors duration-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() => insertMarkdown('**', '**')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Bold (⌘+B)"
                        >
                          <Bold size={15} />
                        </button>
                        <button
                          onClick={() => insertMarkdown('*', '*')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Italic (⌘+I)"
                        >
                          <Italic size={15} />
                        </button>
                        <button
                          onClick={() => insertMarkdown('[', '](url)')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Link (⌘+K)"
                        >
                          <Link size={15} />
                        </button>
                        <button
                          onClick={() => insertMarkdown('- ')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Unordered List (⌘+L)"
                        >
                          <List size={15} />
                        </button>
                        <button
                          onClick={() => insertMarkdown('1. ')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Ordered List (⌘+Shift+L)"
                        >
                            <ListOrdered size={15} />
                        </button>
                        <button
                          onClick={() => setIsImageDialogOpen(true)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Insert Image (⌘+Shift+I)"
                        >
                          <Image size={15} />
                        </button>
                        <div className="relative group">
                          <button
                            onClick={() => setIsLanguageDialogOpen(true)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Code Block (⌘+Shift+C)"
                          >
                            <Code size={15} />
                          </button>
                          <Transition appear show={isLanguageDialogOpen} as={Fragment}>
                            <Dialog 
                              as="div" 
                              className="relative z-50"
                              onClose={() => setIsLanguageDialogOpen(false)}
                            >
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
                                      <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                        Select Language
                                      </Dialog.Title>

                                      <div className="relative mb-4">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                          type="text"
                                          value={searchQuery}
                                          onChange={(e) => setSearchQuery(e.target.value)}
                                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                                          placeholder="Search language..."
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {filteredLanguages.map((lang) => (
                                          <button
                                            key={lang.value}
                                            onClick={() => {
                                              insertCodeBlock(lang.value);
                                              setIsLanguageDialogOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 group"
                                          >
                                            {lang.icon && (
                                              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                                                {lang.icon}
                                              </span>
                                            )}
                                            <span>{lang.name}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </Dialog.Panel>
                                  </Transition.Child>
                                </div>
                              </div>
                            </Dialog>
                          </Transition>
                        </div>
                        <button
                          onClick={() => insertMarkdown('> ')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Quote (⌘+Shift+.)"
                        >
                          <Quote size={15} />
                        </button>
                        
                        <button
                          onClick={insertTable}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="Insert Table"
                          >
                            <Table2 size={15} />
                          </button>
                          <button
                            onClick={insertTaskList}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                            title="Insert Task List"
                          >
                            <CheckSquare size={15} />
                          </button>
                        
                      </div>
                      <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        <Minimize2 size={15} />
                      </button>
                    </div>

                    <textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onScroll={handleScroll}
                      onClick={handleCursorPosition}
                      onKeyUp={handleCursorPosition}
                      className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none font-mono transition-colors duration-200"
                      placeholder="Type your beautiful markdown here..."
                    />

                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between transition-colors duration-200">
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        Ln {cursorPosition.line}, Col {cursorPosition.column}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono flex gap-2">
                        [{new Blob([value]).size} bytes] • [{wordCount} words] • [{charCount} characters]
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <HistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        entries={getHistoryEntries()}
        onSelectVersion={handleVersionSelect}
      />
      <SearchReplaceDialog
        isOpen={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialogOpen(false);
          setSearchHighlights(null);
        }}
        content={value}
        onReplace={onChange}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Editor;