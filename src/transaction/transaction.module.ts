import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {
  TransactionDependingControllers,
  TransactionDependingModules,
  TransactionDependingServices,
} from './utils/dependencies';

@Module({
  imports: TransactionDependingModules,
  controllers: TransactionDependingControllers,
  providers: TransactionDependingServices,
})
export class TransactionModule {}
