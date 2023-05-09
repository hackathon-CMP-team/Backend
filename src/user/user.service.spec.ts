import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
import { UserGender, UserRole } from './user.schema';
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
    role: UserRole.PARENT,
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
  };
  const userInfo2 = {
    email: 'user2@example.com',
    password: 'password',
    name: 'omar',
    phoneNumber: '01032332844',
    role: UserRole.PARENT,
    gender: UserGender.MALE,
    dateOfBirth: new Date(),
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
    it('should create the second user', async () => {
      const user = await service.create(userInfo2);
      expect(user).toBeDefined();
      expect(user.email).toBe(userInfo2.email);
      expect(user.name).toBe(userInfo2.name);
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

  describe('reduce balance', () => {
    beforeAll(async () => {
      await service.reduceBalance(userInfo.phoneNumber, -10000);
    });
    it('should reduce balance', async () => {
      const user = await service.getUserByPhoneNumber(userInfo.phoneNumber);
      const amount = 1000;
      const balance = user.balance;
      await service.reduceBalance(user.phoneNumber, amount);
      const updatedUser = await service.getUserByPhoneNumber(
        userInfo.phoneNumber,
      );
      expect(updatedUser.balance).toBe(balance - amount);
    });
    it('should throw error if balance is not enough', async () => {
      const user = await service.getUserByPhoneNumber(userInfo.phoneNumber);
      const amount = user.balance + 1;
      await expect(
        service.reduceBalance(user.phoneNumber, amount),
      ).rejects.toThrow('not enough');
      const updatedUser = await service.getUserByPhoneNumber(
        userInfo.phoneNumber,
      );
      expect(updatedUser.balance).toBe(user.balance);
    });
    it('should throw error if user is not found', async () => {
      await expect(service.reduceBalance('01000000000', 1000)).rejects.toThrow(
        'not exists',
      );
    });
  });

  describe('move balance', () => {
    it('should move balance', async () => {
      const user = await service.getUserByPhoneNumber(userInfo.phoneNumber);
      const user2 = await service.getUserByPhoneNumber(userInfo2.phoneNumber);
      const amount = 1000;
      const balance = user.balance;
      const balance2 = user2.balance;
      await service.moveBalance(user.phoneNumber, user2.phoneNumber, amount);
      const updatedUser = await service.getUserByPhoneNumber(
        userInfo.phoneNumber,
      );
      const updatedUser2 = await service.getUserByPhoneNumber(
        userInfo2.phoneNumber,
      );
      expect(updatedUser.balance).toBe(balance - amount);
      expect(updatedUser2.balance).toBe(balance2 + amount);
    });

    it('should throw error if balance is not enough', async () => {
      const user = await service.getUserByPhoneNumber(userInfo.phoneNumber);
      const user2 = await service.getUserByPhoneNumber(userInfo2.phoneNumber);
      const amount = user.balance + 1;
      await expect(
        service.moveBalance(user.phoneNumber, user2.phoneNumber, amount),
      ).rejects.toThrow('not enough');
      const updatedUser = await service.getUserByPhoneNumber(
        userInfo.phoneNumber,
      );
      const updatedUser2 = await service.getUserByPhoneNumber(
        userInfo2.phoneNumber,
      );
      expect(updatedUser.balance).toBe(user.balance);
      expect(updatedUser2.balance).toBe(user2.balance);
    });

    it('should throw error if user is not found', async () => {
      await expect(
        service.moveBalance('01000000000', userInfo2.phoneNumber, 1000),
      ).rejects.toThrow('not exists');
      await expect(
        service.moveBalance(userInfo.phoneNumber, '01000000000', 1000),
      ).rejects.toThrow('not exists');
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
