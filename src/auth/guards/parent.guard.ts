import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
/**
 * logged in user guard class
 */
@Injectable()
export class JWTParentGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token)
        throw new UnauthorizedException('you must login to do this action');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const user = await this.userService.getUserByPhoneNumber(
        payload.phoneNumber,
      );
      if (user.role === 'child')
        throw new UnauthorizedException(
          'you must login as parent to do this action',
        );
      if (user.accessToken !== token)
        throw new UnauthorizedException('wrong credentials');
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
