import { useState } from 'react';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Загружаем на imgbb.com (бесплатный сервис)
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', '884cb5c92302f362943fd43a5a52e6a1'); // Получите ключ на https://api.imgbb.com/

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}; 