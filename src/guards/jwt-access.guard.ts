import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAccessTokenStrategyName } from './strategies';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JwtAccessTokenStrategyName) {}
