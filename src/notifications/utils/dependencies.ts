import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { TransactionService } from '../../transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from '../../transaction/transaction.schema';
import { JwtService } from '@nestjs/jwt';
import { TransactionDiscriminators } from '../../transaction/utils/dependencies';
import { NotificationsService } from '../notifications.service';
import { NotificationsController } from '../notifications.controller';
import { ChildrenService } from '../../children/children.service';

export const NotificationDependingModules = [
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

export const NotificationDependingControllers = [NotificationsController];
export const NotificationDependingServices = [
  TransactionService,
  UserService,
  ChildrenService,
  JwtService,
  NotificationsService,
];
