import * as Joi from 'joi';

export interface IAppConfig {
  NODE_ENV: 'development' | 'production';

  HTTP_PORT: number;

  DOMAIN: string;

  ATLANTIS_EPOCH: number;

  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;

  JWT_ACCESS_EXPIRATION_TIME: number;
  JWT_REFRESH_EXPIRATION_TIME: number;

  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_AUTH_USER: string;
  MAIL_AUTH_PASS: string;

  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_MESSAGING_SERVICE_SID: string;
  TWILIO_TEST_ACCOUNT: boolean;
  TWILIO_TEST_ACCOUNT_PHONE_NUMBER: string;

  GIZMO_API_URL: string;
  GIZMO_USER_NAME: string;
  GIZMO_USER_PASSWORD: string;

  FILES_UPLOAD_DIR: string;

  // CONSOLE_LOG_LEVEL: LOG_LEVEL;
}

export const validationSchema = Joi.object<IAppConfig, true>({
  NODE_ENV: Joi.string().valid('development', 'production'),

  HTTP_PORT: Joi.number(),

  DOMAIN: Joi.string(),

  ATLANTIS_EPOCH: Joi.number(),

  JWT_ACCESS_SECRET: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),

  JWT_ACCESS_EXPIRATION_TIME: Joi.number(),
  JWT_REFRESH_EXPIRATION_TIME: Joi.number(),

  MAIL_HOST: Joi.string(),
  MAIL_PORT: Joi.number(),
  MAIL_AUTH_USER: Joi.string(),
  MAIL_AUTH_PASS: Joi.string(),

  TWILIO_ACCOUNT_SID: Joi.string(),
  TWILIO_AUTH_TOKEN: Joi.string(),
  TWILIO_MESSAGING_SERVICE_SID: Joi.string(),
  TWILIO_TEST_ACCOUNT: Joi.boolean(),
  TWILIO_TEST_ACCOUNT_PHONE_NUMBER: Joi.string(),

  GIZMO_API_URL: Joi.string().uri(),
  GIZMO_USER_NAME: Joi.string(),
  GIZMO_USER_PASSWORD: Joi.string(),

  FILES_UPLOAD_DIR: Joi.string(),

  // CONSOLE_LOG_LEVEL: Joi.string().valid(...Object.values(LOG_LEVEL)),
});
