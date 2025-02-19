import React, { Fragment } from 'react';
import { Download, FileText, FileCode, FileDown, FileType, FileEdit, File as FileIcon } from 'lucide-react';
import { useExport } from '../hooks/useExport';
import { Dialog, Transition } from '@headlessui/react';

interface ExportButtonProps {
  markdown: string;
}

const exportFormats = [
  { 
    label: 'Markdown (.md)', 
    format: 'md',
    description: 'Pure Markdown format',
    icon: FileText 
  },
  { 
    label: 'HTML (.html)', 
    format: 'html',
    description: 'HyperText Markup Language with styles',
    icon: FileCode 
  },
  { 
    label: 'PDF (.pdf)', 
    format: 'pdf',
    description: 'Beautiful PDF document',
    icon: FileDown 
  },
  { 
    label: 'Rich Text (.rtf)', 
    format: 'rtf',
    description: 'Rich Text format',
    icon: FileEdit 
  },
  { 
    label: 'Plain Text (.txt)', 
    format: 'txt',
    description: 'Just a plain text',
    icon: FileType 
  },
];

const ExportButton: React.FC<ExportButtonProps> = ({ markdown }) => {
  const { exportFile } = useExport();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Download size={20} />
        <span>Export</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50"
          onClose={() => setIsOpen(false)}
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
                    Export as:
                  </Dialog.Title>

                  <div className="flex flex-col gap-3">
                    {exportFormats.map(({ label, format, description, icon: Icon }) => (
                      <button
                        key={format}
                        onClick={() => {
                          exportFile(markdown, format);
                          setIsOpen(false);
                        }}
                        className="flex items-start gap-4 p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                          </div>
                        </div>
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
  );
};

export default ExportButton;