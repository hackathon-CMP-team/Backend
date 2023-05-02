import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../utils/mongoose-in-memory';
import { UserService } from './user.service';
import {
  UserDependingControllers,
  UserDependingModules,
  UserDependingServices,
} from './utils/dependencies';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
