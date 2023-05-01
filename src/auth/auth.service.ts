import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

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

  async signup(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    const { access_token, refresh_token } = await this.getAuthTokens(user);
    return { access_token, refresh_token };
  }
}
