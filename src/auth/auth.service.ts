import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async getAuthTokens(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    return {
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '20m',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async refreshTheTokens(refresh_token: string) {
    const payload = this.jwtService.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const user = await this.userService.getUserByPhoneNumber(payload.email);
    if (user.refreshToken !== refresh_token)
      throw new UnauthorizedException('refresh token not valid');
    const { access_token, refresh_token: new_refresh_token } =
      await this.getAuthTokens(user);
    return { access_token, refresh_token: new_refresh_token };
  }

  async signup(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    const { access_token, refresh_token } = await this.getAuthTokens(user);
    return { access_token, refresh_token };
  }

  async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByPhoneNumber(dto.phoneNumber);
    const validPassword = await this.comparePassword(
      dto.password,
      user.password,
    );
    if (!validPassword) throw new UnauthorizedException('wrong password');
    const { access_token, refresh_token } = await this.getAuthTokens(user);
    return { access_token, refresh_token };
  }
}
