import { Test, TestingModule } from '@nestjs/testing';
import { closeInMongodConnection } from '../utils/mongoose-in-memory';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  AuthDependingControllers,
  AuthDependingModules,
  AuthDependingServices,
} from './utils/dependencies';
import { UserGender, UserRole } from '../user/user.schema';
import { testDependingModules } from '../utils/test-dependencies';

jest.mock('../utils/mail/mail.service');
describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let userService: UserService;
  let res = { cookie: jest.fn(), json: jest.fn() };
  let userInfo = {
    name: 'name',
    phoneNumber: '01033304427',
    email: 'email@example.com',
    password: 'password',
    gender: UserGender.MALE,
    role: UserRole.PARENT,
    dateOfBirth: new Date(),
  };
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...testDependingModules, ...AuthDependingModules],
      controllers: AuthDependingControllers,
      providers: AuthDependingServices,
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('should return a token', async () => {
      await service.signup(res, userInfo);
      expect(res.cookie).toHaveBeenCalled();
    });
    it('should throw an error if user already exists', async () => {
      await expect(service.signup(res, userInfo)).rejects.toThrow('duplicate');
    });
    afterAll(async () => {
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      await service.logout(user._id);
    });
  });
  describe('login', () => {
    it('should return a token', async () => {
       await service.login(res, {
        phoneNumber: userInfo.phoneNumber,
        password: userInfo.password,
      });
      expect(res.cookie).toHaveBeenCalled();
    });
    it('must throw error because user is signed in', async () => {
      await expect(
        service.login(res, {
          phoneNumber: userInfo.phoneNumber,
          password: userInfo.password,
        }),
      ).rejects.toThrow('user already logged in');
    });
    it('should throw an error if user does not exist', async () => {
      await expect(
        service.login(res, {
          phoneNumber: '01033304428',
          password: userInfo.password,
        }),
      ).rejects.toThrow('phone number not exists');
    });
  });
  describe('logout', () => {
    it('must logout successfully', async () => {
      const user = await userService.getUserByPhoneNumber(userInfo.phoneNumber);
      const res = await service.logout(user._id);
      expect(res).toEqual({ status: 'success' });
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
