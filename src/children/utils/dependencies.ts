import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
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
import { ChildrenController } from '../children.controller';
import { ChildrenService } from '../children.service';
import { WalletService } from '../../wallet/wallet.service';
export const ChildrernDependingModules = [
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

export const ChildrernDependingControllers = [ChildrenController];
export const ChildrernDependingServices = [
  TransactionService,
  UserService,
  JwtService,
  ChildrenService,
  WalletService,
];
