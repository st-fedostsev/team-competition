// api/endpoints/files.ts
import { apiClient } from './client';

export const filesApi = {
  // Загрузить файл
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Убираем Content-Type, браузер сам добавит boundary
    return apiClient.post<{ id: number }>('/api/files/upload', formData);
  },
};