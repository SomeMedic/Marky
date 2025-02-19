import { useCallback } from 'react';
import TurndownService from 'turndown';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

export const useExport = () => {
  const exportFile = useCallback(async (content: string, format: string) => {
    const filename = `document-${Date.now()}`;

    switch (format) {
      case 'md': {
        const blob = new Blob([content], { type: 'text/markdown' });
        downloadBlob(blob, `${filename}.md`);
        break;
      }
      case 'html': {
        const htmlContent = await markdownToHtml(content);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        downloadBlob(blob, `${filename}.html`);
        break;
      }
      case 'pdf': {
        const previewElement = document.querySelector('.prose') as HTMLElement;
        if (!previewElement) return;

        const pdf = new jsPDF();
        const canvas = await toPng(previewElement);
        
        const imgProps = pdf.getImageProperties(canvas);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
        break;
      }
      case 'rtf': {
        const htmlContent = await markdownToHtml(content);
        const rtfContent = await htmlToRtf(htmlContent);
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        downloadBlob(blob, `${filename}.rtf`);
        break;
      }
      case 'txt': {
        const plainText = content.replace(/[#*`_~\[\]]/g, ''); // Удаляем markdown-разметку
        const blob = new Blob([plainText], { type: 'text/plain' });
        downloadBlob(blob, `${filename}.txt`);
        break;
      }
    }
  }, []);

  return { exportFile };
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const markdownToHtml = async (markdown: string): Promise<string> => {
  const response = await fetch('https://api.github.com/markdown', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: markdown,
      mode: 'gfm',
    }),
  });

  if (!response.ok) {
    // Fallback to client-side conversion
    const turndown = new TurndownService();
    return turndown.turndown(markdown);
  }

  const html = await response.text();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Export</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.5.10/dist/typography.min.css">
  <style>
    body { margin: 2rem auto; max-width: 65ch; }
    .markdown-body { padding: 2rem; }
  </style>
</head>
<body>
  <article class="prose prose-slate max-w-none">
    ${html}
  </article>
</body>
</html>`;
};

const htmlToRtf = async (html: string): Promise<string> => {
  // Простая конвертация HTML в RTF
  let rtf = '{\\rtf1\\ansi\\deff0';
  rtf += '{\\fonttbl{\\f0\\fnil\\fcharset0 Arial;}}';
  rtf += '\\viewkind4\\uc1\\pard\\f0\\fs20 ';
  
  // Удаляем HTML-теги и добавляем базовое RTF-форматирование
  const text = html.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  
  rtf += text;
  rtf += '}';
  
  return rtf;
};