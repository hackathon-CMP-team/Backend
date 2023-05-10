import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Types } from 'mongoose';
import { ReturnedUserInfoDto } from '../user/dto/returned-user.dto';
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
    type: ReturnedUserInfoDto,
    headers: {
      'Set-Cookie': {
        description: 'JWT token',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Can't create user" })
  @Post('signup')
  signup(@Res() res: any, @Body() dto: CreateUserDto) {
    return this.authService.signup(res, dto);
  }

  @ApiOperation({ summary: 'login to the website' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: ReturnedUserInfoDto,
    headers: {
      'Set-Cookie': {
        description: 'JWT token',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiCookieAuth()
  @ApiUnauthorizedResponse({ description: 'wrong credentials' })
  @ApiBadRequestResponse({ description: 'user already logged in' })
  @UseGuards(ThrottlerGuard)
  @Post('login')
  login(@Res() res: Express.Response, @Body() dto: LoginDto) {
    return this.authService.login(res, dto);
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
