import { Module } from '@nestjs/common';
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
