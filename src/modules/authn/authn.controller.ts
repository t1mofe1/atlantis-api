import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, HttpCode } from '@nestjs/common';
import { GizmoSmsVerificationConfirmDto } from '../gizmo/dto/smsVerificationConfirm.dto';
import { GizmoService } from '../gizmo/gizmo.service';
import { AuthnService } from './authn.service';
import { SmsTokenDto, StartSmsVerificationDto } from './dto';

@Controller('auth')
export class AuthnController {
  constructor(
    private readonly authnService: AuthnService,
    private readonly gizmoService: GizmoService,
  ) {}

  // #region sms verification
  @HttpCode(200)
  @TypedRoute.Post('sms-start')
  async smsStart(
    @TypedBody() startSmsVerificationDto: StartSmsVerificationDto,
  ) {
    const response = await this.gizmoService.verifications.mobile.start(
      startSmsVerificationDto.phoneNumber,
    );

    // @ts-ignore
    if (response.isError) return false;

    // @ts-ignore
    return response.result;
  }

  @HttpCode(200)
  @TypedRoute.Post('sms-complete')
  async smsComplete(
    @TypedBody() smsVerificationConfirmDto: GizmoSmsVerificationConfirmDto,
  ) {
    const response = await this.gizmoService.verifications.mobile.complete(
      smsVerificationConfirmDto,
    );

    // @ts-ignore
    if (response.isError) return false;

    // INFO: result.data.result === 0 means success
    // INFO: result.data.result === 101 means wrong code?

    // @ts-ignore
    return response.result === 0;
  }
  // #endregion sms verification

  // #region gizmo
  @HttpCode(200)
  @TypedRoute.Post('request-sms-token') // INFO: This url should be set in the gizmo manager
  async requestSmsToken(@TypedQuery() smsTokenDto: SmsTokenDto) {
    const message =
      await this.gizmoService.verifications.mobile.sendSmsToken(smsTokenDto);

    if (!message) return false;

    const failStatus = ['failed', 'undelivered', 'canceled'].includes(
      message.status,
    );

    return !failStatus;
  }
  // #endregion gizmo

  // #region sessions
  // @HttpCode(200)
  // @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('session-start')
  // async sessionStart(
  //   @TypedBody() authSessionCreateDto: AuthSessionCreateDto,
  // ): Promise<AuthSessionCreateResult> {
  //   const { jwt } = await this.authnService.startAuthSession(
  //     authSessionCreateDto,
  //   );

  //   return jwt;
  // }

  // @HttpCode(200)
  // @UseGuards(JwtRefreshGuard)
  // @TypedRoute.Post('session-refresh')
  // async sessionRefresh(
  //   @Req() req: FastifyRequest,
  //   @JwtToken() refreshToken: string,
  // ): Promise<undefined> {
  //   // ): Promise<AuthSessionCreateResult> {
  //   // const { jwt } = await this.authnService.refreshAuthSession({
  //   //   refreshToken,
  //   //   userId: req.user.id.toString(),
  //   // });
  //   // return jwt;
  // }

  // @HttpCode(200)
  // @UseGuards(JwtAccessGuard)
  // @TypedRoute.Post('session-end')
  // async sessionEnd(
  //   @Req() req: FastifyRequest,
  //   @JwtToken() accessToken: string,
  // ) {
  //   // const { user } = await this.authnService.endAuthSession({
  //   //   accessToken,
  //   //   userId: req.user.id.toString(),
  //   // });
  // }
  // #endregion sessions
}
