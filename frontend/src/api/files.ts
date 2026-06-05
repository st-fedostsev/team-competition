// api/files.ts
import { apiClient } from './client';

export interface FileInfo {
  id: number;
  name: string;
  display_name: string;
  size: number;
  author_id: number;
  created_at: string;
}

export const filesApi = {
  // Загрузить файл
  uploadFile: (file: File, displayName?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (displayName) {
      formData.append('display_name', displayName);
    }
    
    return apiClient.post<{ id: number }>('/api/files/upload', formData);
  },

  // Получить информацию о файле
  getFileInfo: (fileId: number) =>
    apiClient.post<FileInfo>('/api/files/get_info', { id: fileId }),

   // Скачать файл
  downloadFile: async (fileId: number): Promise<void> => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`/api/files/download/${fileId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    
    // Получаем имя файла из заголовка Content-Disposition
    const contentDisposition = response.headers.get('content-disposition');
    let fileName = `file_${fileId}`;
    
    if (contentDisposition) {
      // Пробуем получить filename*= (с поддержкой UTF-8)
      const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
      if (filenameStarMatch && filenameStarMatch[1]) {
        fileName = decodeURIComponent(filenameStarMatch[1]);
      } else {
        // Пробуем получить обычный filename
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1];
        }
      }
    }
    
    // Получаем blob и скачиваем
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};