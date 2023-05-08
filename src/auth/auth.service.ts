import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { promisify } from 'util';
import { Types } from 'mongoose';
import { EmailService } from 'src/utils/mail/mail.service';
import { ResetPasswordDto, VerifyOTPDto } from './dto/forget-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private async getAuthToken(user: UserDocument) {
    const payload = {
      phoneNumber: user.phoneNumber,
      email: user.email,
      sub: user._id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '20m',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
    };
  }

  private async sendHelloMail(user: UserDocument) {
    return this.emailService.sendEmail(
      user.email,
      'Welcome to Cash Tap',
      `
        <h1>Hi ${user.name}</h1>
        <p>Thank you for signing up to Cash Tap</p>
        <p> click <button color='blue' background-color='red'><a href="http://localhost:3000/verify/${user._id}">here</a></button> to get more info</p>
        </body>
      `,
    );
  }

  async signup(dto: CreateUserDto) {
    try {
      const user = await this.userService.create(dto);
      const { accessToken } = await this.getAuthToken(user);
      await this.userService.saveAcessToken(accessToken, user._id);
      await this.sendHelloMail(user);
      return {
        accessToken,
        user: {
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: user.role,
          age: this.calculateAge(user.dateOfBirth),
        },
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }

  private calculateAge(dateOfBirth: Date) {
    const difference = Date.now() - dateOfBirth.getTime();
    const age = new Date(difference);
    return Math.abs(age.getUTCFullYear() - 1970);
  }
  async login(dto: LoginDto) {
    const user = await this.userService.getUserByPhoneNumber(dto.phoneNumber);
    if (user.accessToken != null && user.accessTokenWillExpireAt > Date.now())
      throw new BadRequestException('user already logged in');
    const validPassword = await this.comparePassword(
      dto.password,
      user.password,
    );
    if (!validPassword) throw new UnauthorizedException('wrong password');
    const { accessToken } = await this.getAuthToken(user);
    // await this.userService.saveAcessToken(accessToken, user._id);
    return {
      accessToken,
      user: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        age: this.calculateAge(user.dateOfBirth),
      },
    };
  }

  async logout(userId: Types.ObjectId) {
    await this.userService.saveAcessToken(null, userId);
    return { status: 'success' };
  }

  private async sendOTP(user: UserDocument, otp: string) {
    return this.emailService.sendEmail(
      user.email,
      'OTP for Cash Tap',
      `
        <h1>Hi ${user.name}</h1>
        this is your OTP: <b>${otp}</b>
        it will expire in just <b>5 minutes</b>
        `,
    );
  }
  async forgetPassword(phoneNumber: string) {
    const user = await this.userService.getUserByPhoneNumber(phoneNumber);
    if (!user) throw new NotFoundException('user not exists');
    const otp = Math.floor(Math.random() * 1_000_000).toString();
    await this.sendOTP(user, otp);
    await this.userService.saveOTP(phoneNumber, otp);
    return { status: 'success' };
  }

  verifyOTP(dto: VerifyOTPDto) {
    return this.userService.verifyOTP(dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }
}
