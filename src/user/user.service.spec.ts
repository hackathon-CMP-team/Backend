import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
import { UserService } from './user.service';
import {
  UserDependingControllers,
  UserDependingModules,
  UserDependingServices,
} from './utils/dependencies';

describe('UserService', () => {
  const userInfo = {
    email: 'email@example.com',
    password: 'password',
    name: 'omar',
    phoneNumber: '01032332843',
  };
  let service: UserService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        rootMongooseTestModule(),
        ...UserDependingModules,
      ],
      controllers: UserDependingControllers,
      providers: UserDependingServices,
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create user', () => {
    it('should create user', async () => {
      const user = await service.create(userInfo);
      expect(user).toBeDefined();
      expect(user.email).toBe(userInfo.email);
      expect(user.name).toBe(userInfo.name);
    });
    it('should throw error if email is already used', async () => {
      await expect(service.create(userInfo)).rejects.toThrow('duplicate');
    });
  });

  describe('get user by phone number', () => {
    it('should get user by phone number', async () => {
      const user = await service.getUserByPhoneNumber(userInfo.phoneNumber);
      expect(user).toBeDefined();
      expect(user.email).toBe(userInfo.email);
    });
    it('should throw error if phone number is not found', async () => {
      await expect(service.getUserByPhoneNumber('01000000000')).rejects.toThrow(
        'not exists',
      );
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
