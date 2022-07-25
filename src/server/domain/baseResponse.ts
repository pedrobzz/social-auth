export interface BaseServerResponse<T> {
  status: number;
  message?: string;
  data?: T;
}
