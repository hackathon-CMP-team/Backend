import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { UserDocument } from '../../user/user.schema';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  /**
   * Class Constructor
   * @param userService UserService
   */
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * it's called automatically using a guard super class to validate user using token
   * @param payload object get from jwt token
   * @returns the user
   */
  async validate(payload: any): Promise<UserDocument> {
    const user: UserDocument = await this.userService.getUserByPhoneNumber(
      payload.phoneNumber,
    );
    if (user.refreshToken === null)
      throw new UnauthorizedException(
        'sorry but you need to log in to continue',
      );
    return user;
  }
}
