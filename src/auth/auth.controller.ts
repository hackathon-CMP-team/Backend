import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Types } from 'mongoose';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  VerifyOTPDto,
} from './dto/forget-password.dto';
import { LoginDto } from './dto/login.dto';
import { ReturnedAuthInfoDto } from './dto/returned-auth-info.dto';
import { JWTUserGuard } from './guards/user.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // create swagger api documentation
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiOkResponse({
    description: 'User successfully signed up',
    type: ReturnedAuthInfoDto,
  })
  @ApiBadRequestResponse({ description: "Can't create user" })
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'login to the website' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: ReturnedAuthInfoDto,
  })
  @ApiUnauthorizedResponse({ description: 'wrong credentials' })
  @ApiBadRequestResponse({ description: 'user already logged in' })
  @UseGuards(ThrottlerGuard)
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
    return this.authService.logout(req.user._id);
  }

  @ApiOperation({
    summary:
      "request to send OTP(one time password) to be used to verifiy that it's you",
  })
  @ApiOkResponse({ description: 'OTP successfully sent' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @Post('forget-password')
  forgotPassword(@Body() dto: ForgetPasswordDto) {
    return this.authService.forgetPassword(dto.phoneNumber);
  }

  @ApiOperation({ summary: 'verify OTP(one time password)' })
  @ApiOkResponse({ description: 'OTP successfully verified' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @UseGuards(ThrottlerGuard)
  @Post('verify-otp')
  verifyOTP(@Body() dto: VerifyOTPDto) {
    return this.authService.verifyOTP(dto);
  }

  @Post('reset-password')
  @UseGuards(ThrottlerGuard)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
