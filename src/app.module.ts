import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    UserModule,
    AuthModule,
    TransactionModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
