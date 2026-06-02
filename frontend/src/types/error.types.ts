// types/api.types.ts
// Тип для данных ошибки от сервера
export interface ApiErrorData {
  message?: string;
  msg?: string;
  detail?: string;
  [key: string]: unknown;
}

// Класс ошибки для клиента
export class ApiError extends Error {
  response?: {
    data: ApiErrorData;
    status: number;
  };

  constructor(
    message: string,
    response?: { data: ApiErrorData; status: number },
  ) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}
export interface ApiErrorResponse {
  msg?: string;
  message?: string;
  detail?: string;
}
