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

describe('TransactionService', () => {
  let service: TransactionService;
  let module: TestingModule;
  let userService: UserService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        rootMongooseTestModule(),
        ...TransactionDependingModules,
      ],
      controllers: TransactionDependingControllers,
      providers: TransactionDependingServices,
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });
});
