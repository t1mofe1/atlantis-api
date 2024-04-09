import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from '../twilio/twilio.module';
import { GizmoService } from './gizmo.service';

@Module({
  imports: [ConfigModule, TwilioModule, HttpModule],
  providers: [GizmoService],
  exports: [GizmoService],
})
export class GizmoModule {}
