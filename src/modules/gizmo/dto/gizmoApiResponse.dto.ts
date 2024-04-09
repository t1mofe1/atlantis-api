export type GizmoApiResponse<T> = {
  version: null | string;
  httpStatusCode: number;
  isError: false;
  message?: string;
  result: T;
};
