import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { closeInMongodConnection } from 'src/utils/mongoose-in-memory';
import { testDependingModules } from 'src/utils/test-dependencies';
import { NotificationsService } from './notifications.service';
import {
  NotificationDependingControllers,
  NotificationDependingModules,
  NotificationDependingServices,
} from './utils/dependencies';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let userService: UserService;
  let module: TestingModule;
  let transactionService: TransactionService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...testDependingModules, ...NotificationDependingModules],
      controllers: NotificationDependingControllers,
      providers: NotificationDependingServices,
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    userService = module.get<UserService>(UserService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });
});
