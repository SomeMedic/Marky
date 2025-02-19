import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Image, Link, Upload } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdown: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const { uploadImage, isUploading } = useImageUpload();

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onInsert(`![${altText}](${url})`);
      onClose();
      setUrl('');
      setAltText('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        onInsert(`![${file.name}](${imageUrl})`);
        onClose();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <Dialog.Title className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-6">
                <Image className="h-6 w-6 text-indigo-500" />
                Insert Image
              </Dialog.Title>

              <div className="space-y-6">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Image description"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4" />
                        Insert URL Image
                      </>
                    )}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
                  </div>
                </div>

                <div>
                  <label className="block w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Upload from computer
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageUploadDialog; 