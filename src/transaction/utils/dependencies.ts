import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import {
  Transaction,
  TransactionBuyUsingVirtualVisa,
  TransactionBuyUsingVirtualVisaSchema,
  TransactionSchema,
  TransactionTransfer,
  TransactionTransferSchema,
  TransactionVirtualVisa,
  TransactionVirtualVisaSchema,
  TransactionWithdraw,
  TransactionWithdrawSchema,
} from '../transaction.schema';
import { JwtService } from '@nestjs/jwt';

export const TransactionDependingModules = [
  MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    },
    {
      name: Transaction.name,
      schema: TransactionSchema,
      discriminators: [
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
      ],
    },
  ]),
];

export const TransactionDependingControllers = [TransactionController];
export const TransactionDependingServices = [
  TransactionService,
  UserService,
  JwtService,
];
