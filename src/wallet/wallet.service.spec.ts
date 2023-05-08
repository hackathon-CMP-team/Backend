import { Test, TestingModule } from '@nestjs/testing';
import { testDependingModules } from '../utils/test-dependencies';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { closeInMongodConnection } from '../utils/mongoose-in-memory';
import {
  WalletDependingControllers,
  WalletDependingModules,
  WalletDependingServices,
} from './utils/dependencies';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;
  let userService: UserService;
  let transactionService: TransactionService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...testDependingModules, ...WalletDependingModules],
      controllers: WalletDependingControllers,
      providers: WalletDependingServices,
    }).compile();

    service = module.get<WalletService>(WalletService);
    userService = module.get<UserService>(UserService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
