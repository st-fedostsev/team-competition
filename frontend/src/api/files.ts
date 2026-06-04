// api/files.ts
import { apiClient } from './client';

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
};