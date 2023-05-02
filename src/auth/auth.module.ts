import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import {
  AuthDependingControllers,
  AuthDependingModules,
  AuthDependingServices,
} from './utils/dependencies';

@Module({
  imports: AuthDependingModules,
  controllers: AuthDependingControllers,
  providers: AuthDependingServices,
})
export class AuthModule {}
