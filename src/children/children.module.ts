import { Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import {
  ChildrernDependingControllers,
  ChildrernDependingModules,
  ChildrernDependingServices,
} from './utils/dependencies';

@Module({
  imports: ChildrernDependingModules,
  controllers: ChildrernDependingControllers,
  providers: ChildrernDependingServices,
})
export class ChildrenModule {}
