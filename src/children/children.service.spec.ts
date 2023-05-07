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

describe('ChildrenService', () => {
  let service: ChildrenService;
  let userService: UserService;
  let transactionService: TransactionService;
  let module: TestingModule;
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
