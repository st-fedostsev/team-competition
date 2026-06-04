// hooks/useFiles.ts
import { useMutation } from '@tanstack/react-query';
import { filesApi } from '../api/files';

export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, displayName }: { file: File; displayName?: string }) => 
      filesApi.uploadFile(file, displayName),
  });
}