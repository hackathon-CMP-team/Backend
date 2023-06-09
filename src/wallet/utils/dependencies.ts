import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionService } from '../../transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from '../../transaction/transaction.schema';
import { JwtService } from '@nestjs/jwt';
import { WalletController } from '../wallet.controller';
import { WalletService } from '../wallet.service';
import { TransactionDiscriminators } from '../../transaction/utils/dependencies';

export const WalletDependingModules = [
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

export const WalletDependingControllers = [WalletController];
export const WalletDependingServices = [
  TransactionService,
  UserService,
  JwtService,
  WalletService,
];
