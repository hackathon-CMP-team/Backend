import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import {
  NotificationDependingControllers,
  NotificationDependingModules,
  NotificationDependingServices,
} from './utils/dependencies';

@Module({
  imports: NotificationDependingModules,
  controllers: NotificationDependingControllers,
  providers: NotificationDependingServices,
})
export class NotificationsModule {}
