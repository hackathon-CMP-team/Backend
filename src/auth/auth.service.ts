import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async getAuthToken(user: UserDocument) {
    const payload = {
      phoneNumber: user.phoneNumber,
      email: user.email,
      sub: user._id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '20m',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
    };
  }

  async signup(dto: CreateUserDto) {
    try {
      const user = await this.userService.create(dto);
      const { accessToken } = await this.getAuthToken(user);
      await this.userService.saveAcessToken(accessToken, user._id);
      return { accessToken };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByPhoneNumber(dto.phoneNumber);
    if (user.accessToken != null && user.accessTokenWillExpireAt > Date.now())
      throw new BadRequestException('user already logged in');
    const validPassword = await this.comparePassword(
      dto.password,
      user.password,
    );
    if (!validPassword) throw new UnauthorizedException('wrong password');
    const { accessToken } = await this.getAuthToken(user);
    await this.userService.saveAcessToken(accessToken, user._id);
    return { accessToken };
  }


  async logout(userId: Types.ObjectId) {
    await this.userService.saveAcessToken(null, userId);
    return { status: 'success' };
  }
}
