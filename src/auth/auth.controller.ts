import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JWTUserGuard } from './guards/user.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // create swagger api documentation
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiOkResponse({ description: 'User successfully signed up' })
  @ApiBadRequestResponse({ description: "Can't create user" })
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'login to the website' })
  @ApiOkResponse({ description: 'User successfully logged in' })
  @ApiUnauthorizedResponse({ description: 'wrong credentials' })
  @ApiBadRequestResponse({ description: 'user already logged in' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'logout from the website' })
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @ApiBearerAuth()
  @UseGuards(JWTUserGuard)
  @Post('logout')
  logout(@Req() req: any) {
    console.log(req.user);
    return this.authService.logout(req.user._id);
  }
}
