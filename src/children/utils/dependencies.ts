import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionService } from '../../transaction/transaction.service';
import {
  Transaction,
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
} from '../../transaction/transaction.schema';
import { JwtService } from '@nestjs/jwt';
import { ChildrenController } from '../children.controller';
import { ChildrenService } from '../children.service';
import { WalletService } from '../../wallet/wallet.service';
import { TransactionDiscriminators } from '../../transaction/utils/dependencies';
export const ChildrernDependingModules = [
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

export const ChildrernDependingControllers = [ChildrenController];
export const ChildrernDependingServices = [
  TransactionService,
  UserService,
  JwtService,
  ChildrenService,
  WalletService,
];
