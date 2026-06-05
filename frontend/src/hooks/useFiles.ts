// hooks/useFiles.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { filesApi } from '../api/files';
import { useCurrentUser } from './useAuth';

export const filesKeys = {
  all: ['files'] as const,
  info: (id: number) => ['files', 'info', id] as const,
};

// Хук для загрузки файла
export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, displayName }: { file: File; displayName?: string }) => 
      filesApi.uploadFile(file, displayName),
  });
}

// Хук для получения информации о файле
export function useFileInfo(fileId: number | null) {
  const { data: currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: filesKeys.info(fileId!),
    queryFn: async () => {
      const response = await filesApi.getFileInfo(fileId!);
      return response.data;
    },
    enabled: !!currentUser && !!fileId,
    staleTime: 1000 * 60 * 5,
  });
}

// Хук для скачивания файла
export function useDownloadFile() {
  return useMutation({
    mutationFn: (fileId: number) => filesApi.downloadFile(fileId),
  });
}