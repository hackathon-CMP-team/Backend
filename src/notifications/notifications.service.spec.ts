import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument, UserGender, UserRole } from '../user/user.schema';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { closeInMongodConnection } from '../utils/mongoose-in-memory';
import { testDependingModules } from '../utils/test-dependencies';
import { NotificationsService } from './notifications.service';
import {
  NotificationDependingControllers,
  NotificationDependingModules,
  NotificationDependingServices,
} from './utils/dependencies';
import { TransactionTransfer } from '../transaction/transaction.schema';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let userService: UserService;
  let module: TestingModule;
  let transactionService: TransactionService;

  const parentInfo = {
    email: 'email@example.com',
    password: 'password',
    name: 'omar',
    phoneNumber: '01032332843',
    role: UserRole.PARENT,
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
  };
  const childInfo = {
    email: 'user2@example.com',
    password: 'password',
    name: 'omar',
    phoneNumber: '01032332844',
    role: UserRole.CHILD,
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
    parentPhoneNumber: parentInfo.phoneNumber,
    forbiddenCategories: ['food'],
  };
  const userInfo = {
    email: 'user3@example.com',
    password: 'password',
    name: 'omar',
    phoneNumber: '01032332845',
    role: UserRole.PARENT,
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
  };
  let parent: UserDocument;
  let child: UserDocument;
  let user: UserDocument;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...testDependingModules, ...NotificationDependingModules],
      controllers: NotificationDependingControllers,
      providers: NotificationDependingServices,
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    userService = module.get<UserService>(UserService);
    transactionService = module.get<TransactionService>(TransactionService);
    parent = await userService.create(parentInfo);
    child = await userService.create(childInfo);
    user = await userService.create(userInfo);
    userService.reduceBalance(userInfo.phoneNumber, -10000);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get notifications', () => {
    const expectNotificationsFor3Users = async (
      userNumber: number,
      parentNumber: number,
      childNumber: number,
    ) => {
      const parentNotifications = await service.getMyNotifications(
        parent.phoneNumber,
      );
      const childNotifcations = await service.getMyNotifications(
        child.phoneNumber,
      );
      const userNotifications = await service.getMyNotifications(
        user.phoneNumber,
      );
      expect(parentNotifications).toBeDefined();
      expect(parentNotifications.length).toBe(parentNumber);
      expect(childNotifcations).toBeDefined();
      expect(childNotifcations.length).toBe(childNumber);
      expect(userNotifications).toBeDefined();
      expect(userNotifications.length).toEqual(userNumber);
    };
    it('should return notifications', async () => {
      const notifications = await service.getMyNotifications(
        parent.phoneNumber,
      );
      expect(notifications).toBeDefined();
      expect(notifications.length).toBe(0);
    });

    it('should return notifications', async () => {
      const notifications = await service.getMyNotifications(child.phoneNumber);
      expect(notifications).toBeDefined();
      expect(notifications.length).toBe(0);
    });

    it('should return 1 notification because the user transfered money to the children', async () => {
      await transactionService.transfer(
        userInfo.phoneNumber,
        childInfo.phoneNumber,
        100,
      );
      await expectNotificationsFor3Users(0, 1, 0);
    });
    it('should return 1 notification to the user because the parent requested money from him', async () => {
      await transactionService.requestMoney(parent.phoneNumber, {
        amount: 100,
        senderPhone: userInfo.phoneNumber,
      });
      await expectNotificationsFor3Users(1, 1, 0);
    });
    it('should return notifications', async () => {
      await transactionService.requestMoney(child.phoneNumber, {
        amount: 100,
        senderPhone: parent.phoneNumber,
      });
      await expectNotificationsFor3Users(1, 2, 0);
    });
  });

  describe('get notifiations', () => {});
  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });
});
