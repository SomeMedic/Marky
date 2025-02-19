import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Book, Keyboard, Palette, Download, Code, Sparkles, 
  FileText, Calculator, Flask, Table, List, Image, Link as LinkIcon,
  CheckSquare, Quote, Heading, Moon, Sun, GitBranch
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const Documentation: React.FC = () => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Editor</span>
            </Link>
            
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:scale-110"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Marky - The MD Editor Documentation
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto animate-fade-in-up">
            A comprehensive guide to using our powerful Marky - the MD Editor with advanced features and intuitive interface
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-fade-in-up">
            <a href="#getting-started" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm hover:scale-105">
              Get Started
            </a>
            <a href="#shortcuts" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm hover:scale-105">
              View Shortcuts
            </a>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex space-x-8 overflow-x-auto py-4 scrollbar-hide">
            {sections.map((section) => (
              <li key={section.id}>
                <a 
                  href={`#${section.id}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors duration-200"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose dark:prose-dark max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <div key={feature.title} 
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-16">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-20" id={section.id}>
                <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  {section.title}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">
            Made with ❤️ for Markdown enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Keyboard Shortcuts',
    description: 'Boost your productivity with intuitive keyboard shortcuts for all major actions.',
    icon: Keyboard
  },
  {
    title: 'Theme Support',
    description: 'Switch between light and dark themes for comfortable editing in any environment.',
    icon: Palette
  },
  {
    title: 'Multiple Export Formats',
    description: 'Export your documents to MD, HTML, PDF, RTF, and plain text formats.',
    icon: Download
  },
  {
    title: 'Syntax Highlighting',
    description: 'Beautiful syntax highlighting for over 100 programming languages.',
    icon: Code
  },
  {
    title: 'Math & Chemistry',
    description: 'Full support for mathematical equations and chemical formulas using KaTeX.',
    icon: Calculator
  },
  {
    title: 'Advanced Features',
    description: 'Tables, task lists, footnotes, and more with GitHub Flavored Markdown.',
    icon: Sparkles
  }
];

const shortcuts = [
    { key: 'Ctrl(⌘) + B', description: 'Bold text' },
    { key: 'Ctrl(⌘) + I', description: 'Italic text' },
    { key: 'Ctrl(⌘) + K', description: 'Insert link' },
    { key: 'Ctrl(⌘) + L', description: 'Unordered list' },
    { key: 'Ctrl(⌘) + ⇧ + L', description: 'Ordered list' },
    { key: 'Ctrl(⌘) + ⇧ + C', description: 'Code block' },
    { key: 'Ctrl(⌘) + ⇧ + .', description: 'Block quote' },
    { key: 'Ctrl(⌘) + Enter', description: 'Toggle fullscreen' },
    { key: 'Ctrl(⌘) + S', description: 'Save document' },
    { key: 'Ctrl(⌘) + E', description: 'Export document' },
    { key: 'Ctrl(⌘) + Z', description: 'Undo' },
    { key: 'Ctrl(⌘) + ⇧ + Z', description: 'Redo' },
    { key: 'Ctrl(⌘) + ⇧ + I', description: 'Insert Image' },
    { key: 'Ctrl(⌘) + F', description: 'Поиск и замена' },
  ];
  
  const markdownExamples = [
    {
      title: 'Headings',
      icon: Heading,
      markdown: '# Heading 1\n## Heading 2\n### Heading 3',
      result: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>'
    },
    {
      title: 'Text Formatting',
      icon: FileText,
      markdown: '**Bold** and *Italic* and ~~Strikethrough~~',
      result: '<strong>Bold</strong> and <em>Italic</em> and <del>Strikethrough</del>'
    },
    {
      title: 'Lists',
      icon: List,
      markdown: '1. First item\n2. Second item\n\n- Bullet point\n- Another point',
      result: '<ol><li>First item</li><li>Second item</li></ol><ul><li>Bullet point</li><li>Another point</li></ul>'
    },
    {
      title: 'Links & Images',
      icon: LinkIcon,
      markdown: '[Link text](https://example.com)\n![Alt text](mountain.jpg)',
      result: '<a href="https://example.com">Link text</a><br><img src="https://img.goodfon.ru/original/1024x768/3/ef/priroda-gory-kashmir-gora.jpg" alt="Alt text">'
    },
    {
      title: 'Task Lists',
      icon: CheckSquare,
      markdown: '- [ ] Todo item\n- [x] Completed item',
      result: '<ul class="contains-task-list"><li class="task-list-item">Todo item</li><li class="task-list-item" checked>Completed item</li></ul>'
    },
    {
      title: 'Blockquotes',
      icon: Quote,
      markdown: '> This is a blockquote\n> With multiple lines',
      result: '<blockquote>This is a blockquote<br>With multiple lines</blockquote>'
    },
  ];
  
  const exportFormats = [
    {
      type: 'md',
      title: 'Markdown',
      icon: FileText,
      description: 'Export as pure Markdown file, perfect for version control and further editing.'
    },
    {
      type: 'html',
      title: 'HTML',
      icon: Code,
      description: 'Convert to HTML with styling, ready for web publishing.'
    },
    {
      type: 'pdf',
      title: 'PDF Document',
      icon: FileText,
      description: 'Create professional PDF documents with preserved formatting.'
    },
    {
      type: 'rtf',
      title: 'Rich Text',
      icon: FileText,
      description: 'Export as RTF for compatibility with word processors.'
    },
    {
      type: 'txt',
      title: 'Plain Text',
      icon: FileText,
      description: 'Strip formatting for plain text output.'
    }
  ];

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          Our Markdown Editor combines powerful features with an intuitive interface, making it perfect for both beginners and advanced users.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">For Beginners</h3>
            <ol className="list-decimal list-inside space-y-3">
              <li>Start typing in the left panel</li>
              <li>See instant preview on the right</li>
              <li>Use toolbar buttons for formatting</li>
              <li>Save automatically as you type</li>
            </ol>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">For Power Users</h3>
            <ul className="list-disc list-inside space-y-3">
              <li>Use keyboard shortcuts</li>
              <li>Enable sync scrolling</li>
              <li>Export to multiple formats</li>
              <li>Customize theme preferences</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'markdown-syntax',
    title: 'Markdown Syntax Guide',
    content: (
      <div className="space-y-8">
        {markdownExamples.map((example) => (
          <div key={example.title} className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <example.icon className="h-5 w-5 text-indigo-500" />
              {example.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Markdown</p>
                <pre className="font-mono text-sm">{example.markdown}</pre>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Result</p>
                <div dangerouslySetInnerHTML={{ __html: example.result }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
            <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
            <kbd className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-600 shadow-sm min-w-[60px] text-center group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 'math-chemistry',
    title: 'Math & Chemistry Support',
    content: (
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Mathematical Equations</h3>
          <p className="mb-4">Use LaTeX syntax between dollar signs for inline math or double dollar signs for display math:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <pre className="font-mono text-sm bg-white dark:bg-gray-800 p-4 rounded-lg">
              {'$E = mc^2$\n\n$$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$'}
            </pre>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p>Renders as beautiful mathematical equations</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Chemical Formulas</h3>
          <p className="mb-4">Use mhchem syntax for chemical equations:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <pre className="font-mono text-sm bg-white dark:bg-gray-800 p-4 rounded-lg">
              {'$\\ce{H2O}$\n\n$\\ce{CO2 + H2O -> H2CO3}$'}
            </pre>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p>Renders as proper chemical formulas and equations</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'export',
    title: 'Export Options',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportFormats.map((format) => (
          <div key={format.type} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <format.icon className="h-8 w-8 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{format.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{format.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">File extension: .{format.type}</p>
          </div>
        ))}
      </div>
    )
  }
];

// Добавьте в начало файла стили для анимаций
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;

export default Documentation; 