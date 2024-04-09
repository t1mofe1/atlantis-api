import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from '../../interfaces/jwt/JwtTokenPayload.interface';
import { JwtVerifyPayload } from '../../interfaces/jwt/JwtVerifyPayload.interface';
import { Logger } from '../../logger';
import { Snowflake } from '../../utils/Snowflake';
import { AuthSessionCreateDto } from './dto/authSessionCreate.dto';
import { AuthSessionEndDto } from './dto/authSessionEnd.dto';
import { AuthSessionRefreshDto } from './dto/authSessionRefresh.dto';
import { GetJwtTokenDto } from './dto/getJwtToken.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthnService {
  private readonly jwtAccessSecret =
    this.configService.get('JWT_ACCESS_SECRET');
  private readonly jwtRefreshSecret =
    this.configService.get('JWT_REFRESH_SECRET');

  private readonly jwtAccessExpirationTime = this.configService.get(
    'JWT_ACCESS_EXPIRATION_TIME',
  );
  private readonly jwtRefreshExpirationTime = this.configService.get(
    'JWT_REFRESH_EXPIRATION_TIME',
  );

  private readonly logger = new Logger(AuthnService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // #region sessions
  public async startAuthSession(authSessionCreateDto: AuthSessionCreateDto) {
    const userId = new Snowflake(authSessionCreateDto.userId);
    // const userId =
    // authSessionCreateDto.userId instanceof Snowflake
    //   ? authSessionCreateDto.userId
    //   : new Snowflake(authSessionCreateDto.userId);

    const authSessionId = Snowflake.generate();

    const jwt = await this.getJwts({
      userId: userId.toString(),
      mfaEnabled: authSessionCreateDto.mfaEnabled,
      authSessionId: authSessionId.toString(),
      authSessionIndex: 0,
    });

    // const user = await this.prismaService.user
    //   .update({
    //     where: { id: userId.toBigInt() },
    //     data: {
    //       auth_sessions: {
    //         create: {
    //           id: authSessionId.toBigInt(),
    //           index: 0,
    //           access_token: jwt.accessToken,
    //           refresh_token: jwt.refreshToken,
    //           access_token_expires_at: jwt.accessTokenExpiresAt,
    //           refresh_token_expires_at: jwt.refreshTokenExpiresAt,
    //         },
    //       },
    //     },
    //   })
    //   .then((user) => new User(user));

    return {
      jwt,
      // user,
      authSessionId,
    };
  }
  public async refreshAuthSession(
    authSessionRefreshDto: AuthSessionRefreshDto,
  ) {
    const userId = new Snowflake(authSessionRefreshDto.userId);
    // const userId =
    //   authSessionRefreshDto.userId instanceof Snowflake
    //     ? authSessionRefreshDto.userId
    //     : new Snowflake(authSessionRefreshDto.userId);

    const jwtPayload = this.jwtService.verify<JwtVerifyPayload>(
      authSessionRefreshDto.refreshToken,
      { secret: this.jwtRefreshSecret },
    );

    const authSessionId = new Snowflake(jwtPayload.authSessionId);
    const authSessionIndex = jwtPayload.authSessionIndex + 1;

    // TODO: implement error handling
    // const authSession = await this.prismaService.authSession.findUniqueOrThrow({
    //   where: { id: authSessionId.toBigInt() },
    // });

    // if (
    //   // If the user id in the refresh token does not match the user id in the database
    //   authSession.user_id !== new Snowflake(jwtPayload.userId).toBigInt() ||
    //   // If the auth session index in the refresh token does not match the auth session index in the database
    //   authSession.index !== jwtPayload.authSessionIndex ||
    //   // If the refresh token in the database does not match the refresh token in the request
    //   authSession.refresh_token !== authSessionRefreshDto.refreshToken
    // ) {
    //   // TODO: implement security operations like logging out all sessions and sending emails

    //   throw new Error('Invalid refresh token');
    // }

    const jwt = await this.getJwts({
      userId: userId.toString(),
      mfaEnabled: !!jwtPayload.mfaEnabled,
      authSessionId: authSessionId.toString(),
      authSessionIndex,
    });

    // const user = await this.prismaService.user
    //   .update({
    //     where: { id: userId.toBigInt() },
    //     data: {
    //       auth_sessions: {
    //         update: {
    //           where: { id: authSession.id },
    //           data: {
    //             index: authSessionIndex,
    //             access_token: jwt.accessToken,
    //             refresh_token: jwt.refreshToken,
    //             access_token_expires_at: jwt.accessTokenExpiresAt,
    //             refresh_token_expires_at: jwt.refreshTokenExpiresAt,
    //           },
    //         },
    //       },
    //     },
    //   })
    //   .then((user) => new User(user));

    return {
      jwt,
      // user
    };
  }
  public async endAuthSession(authSessionEndDto: AuthSessionEndDto) {
    const userId = new Snowflake(authSessionEndDto.userId);
    // const userId =
    //   authSessionEndDto.userId instanceof Snowflake
    //     ? authSessionEndDto.userId
    //     : new Snowflake(authSessionEndDto.userId);

    const jwtPayload = this.jwtService.verify<JwtVerifyPayload>(
      authSessionEndDto.accessToken,
      { secret: this.jwtAccessSecret },
    );

    if (
      // If the user id in the access token does not match the user id in the database
      userId.toBigInt() !== new Snowflake(jwtPayload.userId).toBigInt()
    ) {
      // TODO: implement security operations like logging out all sessions and sending emails

      throw new Error('Invalid access token');
    }

    const authSessionId = new Snowflake(jwtPayload.authSessionId);

    // const user = await this.prismaService.user
    //   .update({
    //     data: { auth_sessions: { delete: { id: authSessionId.toBigInt() } } },
    //     where: { id: userId.toBigInt() },
    //   })
    //   .then((user) => new User(user));

    // return { user };
  }
  // #endregion sessions

  public async register(registrationData: RegisterDto) {
    // #region check phone verification
    // const userPhoneVerification =
    //   await this.prismaService.userPhoneVerification.findUnique({
    //     where: {
    //       code: registrationData.code,
    //       phone_number: registrationData.phone_number,
    //     },
    //   });

    // if (!userPhoneVerification) {
    //   throw new ForbiddenException('Invalid verification code');
    // }

    // const expiresAt = new Date(
    //   userPhoneVerification.expires_at.getTime() + 1000 * 15,
    // ); // Additional 15 seconds for latency and processing

    // if (expiresAt < new Date()) {
    //   throw new ForbiddenException('Verification code has expired');
    // }

    // await this.prismaService.userPhoneVerification.delete({
    //   where: { id: userPhoneVerification.id },
    // });
    // #endregion check phone verification

    try {
      // const createdUser = await this.usersService.create(registrationData);
      // return createdUser;
    } catch (error) {
      // if (error instanceof PrismaClientKnownRequestError) {
      //   if (error.code === PrismaErrorCode.AlreadyExists) {
      //     // @ts-ignore
      //     const field = error.meta?.target?.[0];

      //     throw new BadRequestException(
      //       field
      //         ? `User with that ${field} already exists`
      //         : 'User already exists',
      //     );
      //   }
      // }

      throw error;
    }
  }

  // #region utils
  public async getJwts(getJwtTokenDto: GetJwtTokenDto) {
    const jwtPayload: JwtTokenPayload = {
      userId: getJwtTokenDto.userId.toString(),
      mfaEnabled: getJwtTokenDto.mfaEnabled,
      authSessionId: getJwtTokenDto.authSessionId.toString(),
      authSessionIndex: getJwtTokenDto.authSessionIndex,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.jwtAccessSecret,
      expiresIn: this.jwtAccessExpirationTime,
    });
    const refreshToken = this.jwtService.sign(jwtPayload, {
      secret: this.jwtRefreshSecret,
      expiresIn: this.jwtRefreshExpirationTime,
    });

    const issuedAt = new Date(Date.now() - 2000); // 2s delay to account for latency

    const accessTokenExpiresAt = new Date(
      Date.now() + this.jwtAccessExpirationTime * 1000,
    );
    const refreshTokenExpiresAt = new Date(
      Date.now() + this.jwtRefreshExpirationTime * 1000,
    );

    return {
      accessToken,
      refreshToken,

      issuedAt,

      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }
  // #endregion utils
}
