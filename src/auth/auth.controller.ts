import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JWTUserGuard } from './guards/user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(JWTUserGuard)
  logout(@Req() req: any) {
    console.log(req.user);
    return this.authService.logout(req.user._id);
  }
}
