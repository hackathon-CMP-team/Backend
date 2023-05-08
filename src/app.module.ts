import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';
import { ChildrenModule } from './children/children.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    MailerModule.forRoot({
      transport: {
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 3,
    // }),
    UserModule,
    AuthModule,
    TransactionModule,
    WalletModule,
    ChildrenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
