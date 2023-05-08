import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
import { UserService } from '../user/user.service';
import { TransactionService } from './transaction.service';
import {
  TransactionDependingControllers,
  TransactionDependingModules,
  TransactionDependingServices,
} from './utils/dependencies';
import {
  TransactionBuyUsingVirtualVisa,
  TransactionTransfer,
  TransactionVirtualVisa,
  TransactionWithdraw,
} from './transaction.schema';
import { testDependingModules } from '../utils/test-dependencies';
import { UserGender, UserRole } from '../user/user.schema';

describe('TransactionService', () => {
  let service: TransactionService;
  let module: TestingModule;
  let userService: UserService;
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
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...testDependingModules, ...TransactionDependingModules],
      controllers: TransactionDependingControllers,
      providers: TransactionDependingServices,
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    userService = module.get<UserService>(UserService);
    await userService.create(userInfo);
    await userService.create(userInfo2);
    await userService.reduceBalance(userInfo.phoneNumber, -10000);
  });

  describe('transfer', () => {
    it('should transfer money', async () => {
      const transferResult = await service.transfer(
        userInfo.phoneNumber,
        userInfo2.phoneNumber,
        100,
      );
      expect(transferResult).toBeDefined();
      expect(transferResult).toEqual({ status: 'success' });
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      const user2 = await userService.getUserByPhoneNumber(
        userInfo2.phoneNumber,
      );
      expect(user.balance).toBe(9900);
      expect(user2.balance).toBe(100);
    });

    it('should throw error if user does not have enough balance', async () => {
      await expect(
        service.transfer(userInfo.phoneNumber, userInfo2.phoneNumber, 10000),
      ).rejects.toThrow('balance');
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        service.transfer(userInfo.phoneNumber, '01032332845', 10000),
      ).rejects.toThrow('exist');
    });
  });

  describe('create virtual card', () => {
    it('should create virtual card', async () => {
      const virtualCard = await service.createVirtualCard(
        userInfo.phoneNumber,
        { amount: 1000 },
      );
      expect(virtualCard).toBeDefined();
      expect(virtualCard.cardNumber.length).toEqual(16);
      expect(virtualCard.cvv.length).toEqual(3);
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        service.createVirtualCard('01032332845', { amount: 1000 }),
      ).rejects.toThrow('exist');
    });

    it('should throw error if user does not have enough balance', async () => {
      await expect(
        service.createVirtualCard(userInfo.phoneNumber, { amount: 10000 }),
      ).rejects.toThrow('balance');
    });
  });

  describe('withdraw', () => {
    it('should withdraw money', async () => {
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      const amount = 1000;
      const withdrawResult = await service.withdraw(userInfo.phoneNumber, {
        amount,
      });
      expect(withdrawResult).toBeDefined();
      expect(withdrawResult).toEqual({ status: 'success' });
      const updatedUser = await userService.getUserByPhoneNumber(
        userInfo.phoneNumber,
      );
      expect(updatedUser.balance).toBe(user.balance - amount);
    });
    it('should throw error if user does not exist', async () => {
      await expect(
        service.withdraw('01032332845', { amount: 1000 }),
      ).rejects.toThrow('exist');
    });
    it('should throw error if user does not have enough balance', async () => {
      await expect(
        service.withdraw(userInfo.phoneNumber, { amount: 10000 }),
      ).rejects.toThrow('balance');
    });
  });

  describe('buy using virtual card', () => {
    let virtualCard: { cvv: string; cardNumber: string };
    it('should buy using virtual card', async () => {
      const amount = 1000;
      virtualCard = await service.createVirtualCard(userInfo.phoneNumber, {
        amount,
      });
      const buyResult = await service.buyUsingVirtualCard({
        amount: 500,
        cardNumber: virtualCard.cardNumber,
        cvv: virtualCard.cvv,
        category: 'food',
        product: 'pizza',
      });
      expect(buyResult).toBeDefined();
      expect(buyResult).toEqual({ status: 'success' });
    });
    it('should throw error if virtual card does not exist', async () => {
      await expect(
        service.buyUsingVirtualCard({
          amount: 500,
          cardNumber: '1234567890123456',
          cvv: '123',
          category: 'food',
          product: 'pizza',
        }),
      ).rejects.toThrow('Invalid card');
    });
    it('should throw error if not enugh balance', async () => {
      await expect(
        service.buyUsingVirtualCard({
          amount: 1000,
          cardNumber: virtualCard.cardNumber,
          cvv: virtualCard.cvv,
          category: 'food',
          product: 'pizza',
        }),
      ).rejects.toThrow('balance');
    });
  });

  describe('get transactions', () => {
    it('should get transactions', async () => {
      const transactions = await service.getUserTransactions(
        userInfo.phoneNumber,
      );
      expect(transactions).toBeDefined();
      // 2 virtual card, 1 withdraw, 1 transfer, 1 buy
      expect(transactions.length).toEqual(5);
      expect(
        transactions.find((t) => t.type === TransactionVirtualVisa.name),
      ).toBeDefined();
      expect(
        transactions.find((t) => t.type === TransactionWithdraw.name),
      ).toBeDefined();
      expect(
        transactions.find((t) => t.type === TransactionTransfer.name),
      ).toBeDefined();
      expect(
        transactions.find(
          (t) => t.type === TransactionBuyUsingVirtualVisa.name,
        ),
      ).toBeDefined();
    });
    it('should return empty array if the user does not exist', async () => {
      expect(await service.getUserTransactions('01032332845')).toEqual([]);
    });
  });

  describe('get income', () => {
    it('should get income', async () => {
      const income = await service.getIncome(userInfo.phoneNumber);
      expect(income).toBeDefined();
      expect(income).toEqual(0);
    });
    it('should get income', async () => {
      const income = await service.getIncome(userInfo2.phoneNumber);
      expect(income).toBeDefined();
      expect(income).toEqual(100);
    });
    it('should return 0 if the user does not exist', async () => {
      expect(await service.getIncome('01032332845')).toBe(0);
    });
  });

  describe('get outcome', () => {
    it('should get outcome', async () => {
      const outcome = await service.getOutcome(userInfo.phoneNumber);
      expect(outcome).toBeDefined();
      // 1000 is withdraw ammount, and 100 is transfer amount
      // 1000 of the virtual card is not counted as outcome because it is not used yet
      expect(outcome).toEqual(1000 + 100 + 500);
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      // note that the 1000 of the virtual card is counted here
      // 2 * 1000 (virtual card) + 1 * 1000 (withdraw) + 1 * 100 (transfer)
      expect(user.balance).toBe(10000 - 1000 - 1000 - 100 - 1000);
    });
    it('should get outcome', async () => {
      const outcome = await service.getOutcome(userInfo2.phoneNumber);
      expect(outcome).toBeDefined();
      expect(outcome).toEqual(0);
    });
    it('should return 0 if the user does not exist', async () => {
      expect(await service.getOutcome('01032332845')).toBe(0);
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });
});
