import React, { useState, Fragment } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeToggle from './components/ThemeToggle';
import ExportButton from './components/ExportButton';
import { FileEdit, Link2, Link2Off, Book } from 'lucide-react';
import { useAutosave } from './hooks/useAutosave';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Documentation from './components/Documentation';

const initialMarkdown = `# Welcome to the Marky - the Enhanced Markdown Editor!

This is a **live preview** editor that supports _GitHub Flavored Markdown_.

## Features:
- Real-time preview with auto-save
- Syntax highlighting with language selection
- GitHub Flavored Markdown support
- Full-screen editing mode (Ctrl+Enter)
- Keyboard shortcuts for all actions
- Word and character count
- Dark mode support 🌙
- Export to MD, HTML, and PDF

### Code Example:

\`\`\`javascript
// Try the language selector for code blocks!
function greeting(name) {
  return \`Hello, \${name}!\`;
}
console.log(greeting('World'));
\`\`\`

## Images
![](https://img.goodfon.ru/original/1024x768/3/ef/priroda-gory-kashmir-gora.jpg)

## Tables
| Feature | Status |
|---------|--------|
| Tables | ✅ |
| Task Lists | ✅ |
| Math | ✅ |

## Task Lists
- [ ] Todo item
- [x] Completed item

## Math Equations
Inline math: $E = mc^2$

Block math:
$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

## Footnotes
Here's a sentence with a footnote[^1].

## Chemical Equations
Simple molecule: $\{H2O}$

Chemical reaction:
$\{CO2 + C -> 2 CO}$

Complex reaction:
$$\{Zn^2+ <=>[+ 2OH-][+ 2H+] Zn(OH)2 v <=> ZnO + H2O}$$

[^1]: This is the footnote.

> Try editing this text to see the live preview in action!
> Your changes are automatically saved.

Visit the [GitHub Markdown Guide](https://guides.github.com/features/mastering-markdown/) to learn more.
`;

function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [syncScroll, setSyncScroll] = useState(false);

  useAutosave(markdown, setMarkdown);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
              <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileEdit className="h-6 w-6 text-gray-700 dark:text-gray-100" />
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Marky
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      to="/docs" 
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Book size={20} />
                      <span>Docs</span>
                    </Link>
                    <ExportButton markdown={markdown} />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-12rem)]">
                  <div className="border-r border-gray-200 dark:border-gray-700">
                    <Editor value={markdown} onChange={setMarkdown} />
                  </div>
                  <div className="overflow-auto">
                    <Preview content={markdown} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        } />
        <Route path="/docs" element={<Documentation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;