import { Test, TestingModule } from '@nestjs/testing';
import { testDependingModules } from 'src/utils/test-dependencies';
import { NotificationsService } from './notifications.service';
import {
  NotificationDependingControllers,
  NotificationDependingModules,
  NotificationDependingServices,
} from './utils/dependencies';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...testDependingModules, ...NotificationDependingModules],
      controllers: NotificationDependingControllers,
      providers: NotificationDependingServices,
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
