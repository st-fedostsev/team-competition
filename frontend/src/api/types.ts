// Мб удалить придется
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type RequestBody = JsonValue;

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}