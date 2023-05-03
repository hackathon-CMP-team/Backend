import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ParsedQs } from 'qs';

import type { UserDocument } from '../../user/user.schema';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  /**
   * Class Constructor
   * @param userService UserService
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  /**
   * it's called automatically using a guard super class to validate user using token
   * @param payload object get from jwt token
   * @returns the user
   */
  async validate(payload: any): Promise<UserDocument> {
    console.log(1);
    const user: UserDocument = await this.userService.getUserByPhoneNumber(
      payload.phoneNumber,
    );
    if (user.accessToken === null)
      throw new UnauthorizedException(
        'sorry but you need to log in to continue',
      );
    return user;
  }

  async authenticate(req, options) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      console.log(payload);
      const user = await this.userService.getUserByPhoneNumber(
        payload.phoneNumber,
      );
      if (user.accessToken !== token)
        throw new UnauthorizedException(
          'sorry but you need to log in to continue',
        );

      req.user = user;
      console.log('returned');
      return true;

      // Do something with the user object
      
    }
  }
}
