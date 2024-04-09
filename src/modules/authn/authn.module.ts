import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from '../../guards/strategies/jwtAccessToken.strategy';
import { JwtRefreshTokenStrategy } from '../../guards/strategies/jwtRefreshToken.strategy';
import { GizmoModule } from '../gizmo/gizmo.module';
import { AuthnController } from './authn.controller';
import { AuthnService } from './authn.service';

@Module({
  imports: [PassportModule, ConfigModule, JwtModule.register({}), GizmoModule],
  providers: [AuthnService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthnController],
  exports: [AuthnService],
})
export class AuthnModule {}
