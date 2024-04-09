import { GizmoApiResponse } from './gizmoApiResponse.dto';

export type GizmoErrorDto = Omit<GizmoApiResponse<null>, 'isError'> & {
  isError: true;
  errorCodeType: number;
  errorCodeTypeReadable: string;
  errorCode: number;
  errorCodeReadable: string;
  errors: Record<string, unknown>[];
};
