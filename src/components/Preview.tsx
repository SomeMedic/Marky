import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.js';
import katex from 'katex';

interface PreviewProps {
  content: string;
  syncScroll?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content, syncScroll }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Добавляем слушатель события скролла от Editor
  useEffect(() => {
    if (!syncScroll) return;

    const handleEditorScroll = (e: Event) => {
      const { scrollPercentage } = (e as CustomEvent).detail;
      const preview = previewRef.current;
      
      if (preview) {
        const scrollHeight = preview.scrollHeight - preview.clientHeight;
        preview.scrollTop = scrollHeight * scrollPercentage;
      }
    };

    window.addEventListener('editor-scroll', handleEditorScroll);
    return () => window.removeEventListener('editor-scroll', handleEditorScroll);
  }, [syncScroll]);

  // Добавляем обработчик скролла Preview
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!syncScroll) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    window.dispatchEvent(new CustomEvent('preview-scroll', { 
      detail: { scrollPercentage } 
    }));
  }, [syncScroll]);

  const processChemicalFormulas = (text: string) => {
    // Заменяем блочные химические формулы
    text = text.replace(/\$\$(\\ce{[^}]+})\$\$/g, (_, formula) => {
      try {
        return katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: { "\\ce": "\\ce" }
        });
      } catch (e) {
        console.error('KaTeX error:', e);
        return formula;
      }
    });

    // Заменяем инлайн химические формулы
    text = text.replace(/\$(\\ce{[^}]+})\$/g, (_, formula) => {
      try {
        return katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: { "\\ce": "\\ce" }
        });
      } catch (e) {
        console.error('KaTeX error:', e);
        return formula;
      }
    });

    return text;
  };

  // Предварительно обрабатываем контент
  const processedContent = processChemicalFormulas(content);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
    }
  };

  return (
    <div 
      ref={previewRef}
      onScroll={handleScroll}
      className="prose dark:prose-dark max-w-none p-4 overflow-auto bg-white dark:bg-gray-800 transition-colors duration-200"
    >
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: true }]
        ]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeKatex, {
            output: 'html',
            trust: true,
            strict: false,
            throwOnError: false,
            globalGroup: true,
          }]
        ]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            
            const code = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <div className="not-prose relative group">
                <div className="absolute right-2 top-2 flex items-center gap-2">
                  {match[1] && (
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-2 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded">
                      {match[1]}
                    </span>
                  )}
                  <button
                    onClick={() => handleCopy(code)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded bg-gray-100 dark:bg-gray-800/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Copy code"
                  >
                    {copiedCode === code ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          li: ({ node, checked, children, ...props }) => {
            if (checked !== null && checked !== undefined) {
              return (
                <li {...props} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mt-1"
                  />
                  <span>{children}</span>
                </li>
              );
            }
            return <li {...props}>{children}</li>;
          },
          img: ({ node, ...props }) => (
            <img 
              {...props} 
              className="max-w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default Preview;