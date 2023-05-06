import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import {
  WalletDependingControllers,
  WalletDependingModules,
  WalletDependingServices,
} from './utils/dependencies';

@Module({
  imports: WalletDependingModules,
  controllers: WalletDependingControllers,
  providers: WalletDependingServices,
})
export class WalletModule {}
