import { ConfigModule } from '@nestjs/config';
import { rootMongooseTestModule } from './mongoose-in-memory';
import { MailerModule } from '@nestjs-modules/mailer';

export const testDependingModules = [
  ConfigModule.forRoot(),
  rootMongooseTestModule(),
  MailerModule.forRoot({
    transport: {
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  }),
];
