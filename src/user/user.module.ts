import { Module } from '@nestjs/common';
import {
  UserDependingControllers,
  UserDependingModules,
  UserDependingServices,
} from './utils/dependencies';
@Module({
  imports: UserDependingModules,
  controllers: UserDependingControllers,
  providers: UserDependingServices,
})
export class UserModule {}
