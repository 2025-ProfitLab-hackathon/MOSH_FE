export interface ResponseDTO<T> {
  data: T;
  code: string;
  message: string;
}
