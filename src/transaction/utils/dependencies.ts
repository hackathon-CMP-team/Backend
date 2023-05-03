import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';
import { Transaction } from 'mongodb';
import {
  TransactionSchema,
  TransactionTransfer,
  TransactionTransferSchema,
  TransactionVirtualVisa,
  TransactionVirtualVisaSchema,
  TransactionWithdraw,
  TransactionWithdrawSchema,
} from '../transaction.schema';

export const TransacionDependingModules = [
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
      ],
    },
  ]),
];

export const TransacionDependingControllers = [TransactionController];
export const TransactionDependingServices = [TransactionService, UserService];
