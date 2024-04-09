import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Method, RawAxiosRequestHeaders } from 'axios';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Logger } from '../../logger';
import { SmsTokenDto } from '../authn/dto';
import { TwilioService } from '../twilio/twilio.service';
import { GizmoApiResponse } from './dto/gizmoApiResponse.dto';
import { GizmoErrorDto } from './dto/gizmoError.dto';
import { GizmoSmsVerificationResultDto } from './dto/gizmoSmsVerificationResult.dto';
import { GizmoSmsVerificationConfirmDto } from './dto/smsVerificationConfirm.dto';

type RequestData = {
  headers?: RawAxiosRequestHeaders;
  body?: unknown;
  params?: Record<string, unknown>;
  method?: Method;
};

@Injectable()
export class GizmoService {
  private readonly gizmoUrl = this.configService.get('GIZMO_API_URL');
  private readonly gizmoUsername = this.configService.get('GIZMO_USER_NAME');
  private readonly gizmoPassword = this.configService.get(
    'GIZMO_USER_PASSWORD',
  );

  private readonly logger = new Logger(GizmoService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly httpService: HttpService,
  ) {}

  private gizmoRequest<Result>(url: string, data?: RequestData) {
    return firstValueFrom(
      this.httpService
        .request<GizmoApiResponse<Result>>({
          baseURL: this.gizmoUrl,
          url,
          auth: { username: this.gizmoUsername, password: this.gizmoPassword },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...data?.headers,
          },
          data: data?.body,
          params: data?.params,
          method: data?.method ?? 'GET',
        })
        .pipe(
          map((res) => res.data),
          catchError((error) => {
            this.logger.error(error);

            return of<GizmoErrorDto>(error);
          }),
        ),
    );
  }

  public verifications = {
    mobile: {
      sendSmsToken: async (smsTokenDto: SmsTokenDto) => {
        this.logger.debug(`${smsTokenDto.To}: ${smsTokenDto.Body}`);

        const message = await this.twilioService.sendMessage({
          text: smsTokenDto.Body,
          to: smsTokenDto.To,
        });

        return message;
      },
      start: async (phoneNumber: string) => {
        const url = `/verifications/mobilephone/${phoneNumber}`;

        return this.gizmoRequest<GizmoSmsVerificationResultDto>(url, {
          method: 'POST',
        });
      },
      complete: async (
        smsVerificationConfirmDto: GizmoSmsVerificationConfirmDto,
      ) => {
        const url = `/verifications/mobilephone/${smsVerificationConfirmDto.token}/${smsVerificationConfirmDto.confirmationCode}/complete`;

        return this.gizmoRequest<number>(url, {
          method: 'POST',
        });
      },
    },
  };
}
