export interface BaseServerResponse<T = Record<string, unknown>> {
  status: number;
  message?: string;
  data?: T;
}
