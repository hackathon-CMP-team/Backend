import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTUserGuard } from '../auth/guards/user.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JWTUserGuard)
  @Get('me/balance')
  getMyBalance(@Req() req: any) {
    return this.userService.getUserBalance(req.user);
  }
}
