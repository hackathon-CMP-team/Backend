import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { ChildrenService } from './children.service';
import {
  ChildrernDependingControllers,
  ChildrernDependingModules,
  ChildrernDependingServices,
} from './utils/dependencies';
import { UserDocument, UserGender, UserRole } from '../user/user.schema';

describe('ChildrenService', () => {
  let service: ChildrenService;
  let userService: UserService;
  let transactionService: TransactionService;
  let module: TestingModule;
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
      imports: [
        ConfigModule.forRoot(),
        rootMongooseTestModule(),
        ...ChildrernDependingModules,
      ],
      controllers: ChildrernDependingControllers,
      providers: ChildrernDependingServices,
    }).compile();

    service = module.get<ChildrenService>(ChildrenService);
    userService = module.get<UserService>(UserService);
    transactionService = module.get<TransactionService>(TransactionService);
    parent = await userService.create(parentInfo);
    child = await userService.create(childInfo);
    user = await userService.create(userInfo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add forbidden categries', () => {
    it('should add forbidden categories', async () => {
      const categories = ['food', 'clothes'];
      const result = await service.addForbiddenCategories(parent.phoneNumber, {
        categories,
        childPhoneNumber: child.phoneNumber,
      });
      expect(result).toBeDefined();
      expect(result.forbiddenCategories).toEqual(categories);
    });
    it('should throw error if child not found', async () => {
      const categories = ['food', 'clothes'];
      await expect(
        service.addForbiddenCategories(parent.phoneNumber, {
          categories,
          childPhoneNumber: '01032332846',
        }),
      ).rejects.toThrowError();
    });
    it('should throw error if parent not found', async () => {
      const categories = ['food', 'clothes'];
      await expect(
        service.addForbiddenCategories('01032332846', {
          categories,
          childPhoneNumber: child.phoneNumber,
        }),
      ).rejects.toThrowError();
    });
    it('should throw error if i am not the parent', async () => {
      const categories = ['food', 'clothes'];
      await expect(
        service.addForbiddenCategories(user.phoneNumber, {
          categories,
          childPhoneNumber: child.phoneNumber,
        }),
      ).rejects.toThrowError();
    });
    it('should return old and new forbidden categories', async () => {
      const categories = ['food', 'clothes'];
      const newCategories = ['food', 'drinks'];
      await service.addForbiddenCategories(parent.phoneNumber, {
        categories,
        childPhoneNumber: child.phoneNumber,
      });
      const result = await service.addForbiddenCategories(parent.phoneNumber, {
        categories: newCategories,
        childPhoneNumber: child.phoneNumber,
      });
      expect(result).toBeDefined();
      expect(result.forbiddenCategories).toEqual(['food', 'clothes', 'drinks']);
    });
  });
  describe('get forbidden categories', () => {
    it('should get forbidden categories', async () => {
      const result = await service.getForbiddenCategories(parent.phoneNumber, {
        childPhoneNumber: child.phoneNumber,
      });
      expect(result.forbiddenCategories).toBeDefined();
      expect(result.forbiddenCategories).toEqual(['food', 'clothes', 'drinks']);
    });
    it('should throw error if child not found', async () => {
      await expect(
        service.getForbiddenCategories(parent.phoneNumber, {
          childPhoneNumber: '01032332846',
        }),
      ).rejects.toThrowError();
    });
    it('should throw error if parent not found', async () => {
      await expect(
        service.getForbiddenCategories('01032332846', {
          childPhoneNumber: child.phoneNumber,
        }),
      ).rejects.toThrowError();
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
