import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/mongoose-in-memory';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  AuthDependingControllers,
  AuthDependingModules,
  AuthDependingServices,
} from './utils/dependencies';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        rootMongooseTestModule(),
        ...AuthDependingModules,
      ],
      controllers: AuthDependingControllers,
      providers: AuthDependingServices,
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
