// api/client.ts
import { useAuthStore } from '../stores/authStore';
import { ApiError } from '../types/error.types';

const BASE_URL = '';

interface ApiResponse<T = void> {
  data: T;
  status: number;
}

// Расширяем тип, чтобы принимать любые объекты и FormData
type RequestData =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | object
  | FormData;

interface RequestConfig {
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = void>(
    endpoint: string,
    method: string,
    body?: RequestData,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, headers: customHeaders = {} } = config;
    
    const accessToken = requiresAuth
      ? useAuthStore.getState().accessToken
      : null;

    const headers = new Headers();

    // Если body это FormData - не устанавливаем Content-Type (браузер сам добавит boundary)
    if (!(body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    Object.entries(customHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    if (requiresAuth && accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Подготовка body: FormData не нужно строкифицировать
    let requestBody: BodyInit | undefined;
    if (body instanceof FormData) {
      requestBody = body;
    } else if (body !== undefined) {
      requestBody = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      body: requestBody,
      credentials: 'omit',
    });

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch {
      data = {} as T;
    }

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login-student';
      }

      const errorData = data as { message?: string; msg?: string; detail?: string };
      const errorMessage = errorData.message || errorData.msg || errorData.detail || `Ошибка ${response.status}`;
      
      const error = new ApiError(errorMessage, {
        data: errorData,
        status: response.status,
      });
      
      throw error;
    }

    return { data, status: response.status };
  }

  get<T = void>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, config);
  }

  post<T = void>(
    endpoint: string,
    body?: RequestData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', body, config);
  }

  put<T = void>(
    endpoint: string,
    body?: RequestData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', body, config);
  }

  delete<T = void>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, config);
  }
}

export const apiClient = new ApiClient();