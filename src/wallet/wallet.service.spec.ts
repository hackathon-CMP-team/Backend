import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
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
      imports: [
        ConfigModule.forRoot(),
        rootMongooseTestModule(),
        ...WalletDependingModules,
      ],
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
