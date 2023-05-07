import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionController } from '../../transaction/transaction.controller';
import { TransactionService } from '../../transaction/transaction.service';
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
} from '../../transaction/transaction.schema';
import { JwtService } from '@nestjs/jwt';
import { WalletController } from '../wallet.controller';
import { WalletService } from '../wallet.service';

export const WalletDependingModules = [
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

export const WalletDependingControllers = [WalletController];
export const WalletDependingServices = [
  TransactionService,
  UserService,
  JwtService,
  WalletService,
];
