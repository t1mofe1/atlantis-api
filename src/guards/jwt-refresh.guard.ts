import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessTokenStrategyName } from './strategies';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JwtAccessTokenStrategyName) {}
