import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../../user/user.module';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../transaction.service';

export const UserDependingModules = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
];

export const UserDependingControllers = [TransactionController];
export const UserDependingServices = [TransactionService, UserService];
