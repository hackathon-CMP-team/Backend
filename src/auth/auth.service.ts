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
import { Types } from 'mongoose';
import { EmailService } from '../utils/mail/mail.service';
import { ResetPasswordDto, VerifyOTPDto } from './dto/forget-password.dto';
import { ReturnedAuthInfoDto } from './dto/returned-auth-info.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Get auth token for a user.
   * @param {UserDocument} user - The user to get the auth token for.
   * @returns {Promise<{accessToken: string}>} Object containing the access token.
   */
  private async getAuthToken(
    user: UserDocument,
  ): Promise<{ accessToken: string }> {
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

  /**
   * Send a welcome email to a new user.
   * @param {UserDocument} user - The user to send the email to.
   * @returns {Promise<void>}
   */
  private async sendHelloMail(user: UserDocument): Promise<void> {
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

  /**
   * Get auth information for a user.
   * @param {UserDocument} user - The user to get the auth information for.
   * @returns {Object} Object containing the access token and user information.
   */
  private async getAuthInfo(user: UserDocument): Promise<ReturnedAuthInfoDto> {
    const { accessToken } = await this.getAuthToken(user);
    await this.userService.saveAcessToken(accessToken, user._id);
    return {
      accessToken,
      user: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        age: this.calculateAge(user.dateOfBirth),
        gender: user.gender,
      },
    };
  }

  /**
   * Create a new user.
   * @param {CreateUserDto} dto - The DTO containing user information.
   * @returns {Promise<Object>} Object containing the auth information for the new user.
   */
  async signup(dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    await this.sendHelloMail(user);
    return this.getAuthInfo(user);
  }

  /**
   * Compare a password with a hashed password.
   * @param {string} password - The password to compare.
   * @param {string} hashPassword - The hashed password to compare.
   * @returns {Promise<boolean>} A boolean indicating whether the password matches the hashed password.
   */
  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  /**
   * Calculate the age of a user.
   * @param {Date} dateOfBirth - The date of birth of the user.
   * @returns {number} The age of the user.
   */
  private calculateAge(dateOfBirth: Date) {
    const difference = Date.now() - dateOfBirth.getTime();
    const age = new Date(difference);
    return Math.abs(age.getUTCFullYear() - 1970);
  }

  /**
   * Authenticates a user with the provided login credentials.
   * Throws an error if the user is already logged in or if the password is invalid.
   * @param {LoginDto} dto - Login credentials
   * @returns {Promise<AuthInfo>} - Returns an authentication token if the user is successfully authenticated.
   * @throws {BadRequestException} - Throws an error if the user is already logged in.
   * @throws {UnauthorizedException} - Throws an error if the password is invalid.
   */
  async login(dto: LoginDto): Promise<ReturnedAuthInfoDto> {
    const user = await this.userService.getUserByPhoneNumber(dto.phoneNumber);
    if (user.accessToken != null && user.accessTokenWillExpireAt > Date.now())
      throw new BadRequestException('user already logged in');
    const validPassword = await this.comparePassword(
      dto.password,
      user.password,
    );
    if (!validPassword) throw new UnauthorizedException('wrong password');
    return this.getAuthInfo(user);
  }

  /**
   * Logs out a user with the provided userId by setting the user's access token to null.
   * @param {Types.ObjectId} userId - ID of the user to log out.
   * @returns {Promise<{ status: string }>} - Returns a success message on successful logout.
   */
  async logout(userId: Types.ObjectId): Promise<{ status: string }> {
    await this.userService.saveAcessToken(null, userId);
    return { status: 'success' };
  }

  /**
   * Sends an OTP (one-time password) to a user's email.
   * @param {UserDocument} user - User object to send the OTP to.
   * @param {string} otp - OTP to send to the user.
   * @returns {Promise<void>} - Returns nothing on successful OTP send.
   */
  private async sendOTP(user: UserDocument, otp: string): Promise<void> {
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
  /**
   * Sends an OTP to a user's email for password recovery.
   * @param {string} phoneNumber - Phone number of the user requesting password recovery.
   * @returns {Promise<{ status: string }>} - Returns a success message on successful OTP send.
   * @throws {NotFoundException} - Throws an error if the user does not exist.
   */
  async forgetPassword(phoneNumber: string): Promise<{ status: string }> {
    const user = await this.userService.getUserByPhoneNumber(phoneNumber);
    if (!user) throw new NotFoundException('user not exists');
    const otp = Math.floor(Math.random() * 1_000_000).toString();
    await this.sendOTP(user, otp);
    await this.userService.saveOTP(phoneNumber, otp);
    return { status: 'success' };
  }
  /**
   * Verifies an OTP (one-time password) provided by a user during password recovery.
   * @param {VerifyOTPDto} dto - DTO containing the OTP and user information to verify.
   * @returns {Promise<{status: string}>} - Returns nothing on successful OTP verification.
   */
  verifyOTP(dto: VerifyOTPDto): Promise<{ status: string }> {
    return this.userService.verifyOTP(dto);
  }

  /**
   * Resets a user's password with a new password.
   * @param {ResetPasswordDto} dto - DTO containing the new password and user information to reset.
   * @returns {Promise<{status: string}>} - Returns nothing on successful password reset.
   */
  resetPassword(dto: ResetPasswordDto): Promise<{ status: string }> {
    return this.userService.resetPassword(dto);
  }
}
