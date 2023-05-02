import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../../user/user.module';
import { User, UserSchema } from '../../user/user.schema';
import { UserService } from '../../user/user.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

export const AuthDependingModules = [
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15d' },
  }),
  UserModule,
];

export const AuthDependingControllers = [AuthController];
export const AuthDependingServices = [AuthService, UserService, JwtService];
