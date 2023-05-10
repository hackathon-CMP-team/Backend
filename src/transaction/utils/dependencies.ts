import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import {
  Transaction,
  TransactionBills,
  TransactionBillsSchema,
  TransactionBuyUsingVirtualVisa,
  TransactionBuyUsingVirtualVisaSchema,
  transactionRequestMoney,
  transactionRequestMoneySchema,
  TransactionSchema,
  TransactionTransfer,
  TransactionTransferSchema,
  TransactionVirtualVisa,
  TransactionVirtualVisaSchema,
  TransactionWithdraw,
  TransactionWithdrawSchema,
} from '../transaction.schema';
import { JwtService } from '@nestjs/jwt';

export const TransactionDiscriminators = [
  {
    name: TransactionTransfer.name,
    schema: TransactionTransferSchema,
  },
  {
    name: TransactionWithdraw.name,
    schema: TransactionWithdrawSchema,
  },
  {
    name: TransactionVirtualVisa.name,
    schema: TransactionVirtualVisaSchema,
  },
  {
    name: TransactionBuyUsingVirtualVisa.name,
    schema: TransactionBuyUsingVirtualVisaSchema,
  },
  {
    name: transactionRequestMoney.name,
    schema: transactionRequestMoneySchema,
  },
  {
    name: TransactionBills.name,
    schema: TransactionBillsSchema,
  },
];

export const TransactionDependingModules = [
  MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    },
    {
      name: Transaction.name,
      schema: TransactionSchema,
      discriminators: TransactionDiscriminators,
    },
  ]),
];

export const TransactionDependingControllers = [TransactionController];
export const TransactionDependingServices = [
  TransactionService,
  UserService,
  JwtService,
];
