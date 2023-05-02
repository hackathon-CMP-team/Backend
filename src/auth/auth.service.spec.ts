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
import { UserDocument } from 'src/user/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let userService: UserService;
  let userInfo = {
    name: 'name',
    phoneNumber: '01033304427',
    email: 'email@example.com',
    password: 'password',
  };
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        rootMongooseTestModule(),
        ...AuthDependingModules,
      ],
      controllers: AuthDependingControllers,
      providers: AuthDependingServices,
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('should return a token', async () => {
      const { accessToken, refreshToken } = await service.signup(userInfo);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
    it('should throw an error if user already exists', async () => {
      await expect(service.signup(userInfo)).rejects.toThrow('duplicate');
    });
  });
  describe('login', () => {
    it('should return a token', async () => {
      const { accessToken, refreshToken } = await service.login({
        phoneNumber: userInfo.phoneNumber,
        password: userInfo.password,
      });
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
    it('should throw an error if user does not exist', async () => {
      await expect(
        service.login({
          phoneNumber: '01033304428',
          password: userInfo.password,
        }),
      ).rejects.toThrow('phone number not exists');
    });
  });
  describe('refreshTheTokens', () => {
    it('should return a token', async () => {
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      const { accessToken, refreshToken } = await service.refreshTheTokens(
        user.refreshToken,
      );
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
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
