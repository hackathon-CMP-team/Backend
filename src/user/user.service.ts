import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import {
  ResetPasswordDto,
  VerifyOTPDto,
} from '../auth/dto/forget-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Retrieves the user with the given phone number.
   * @param phoneNumber The phone number of the user to retrieve.
   * @returns The user with the given phone number.
   * @throws NotFoundException If no user with the given phone number exists.
   */
  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) throw new NotFoundException('phone number not exists');
    return user;
  }

  /**
   * Creates a new user based on the provided user data.
   * @param dto The user data to create the new user.
   * @returns The newly created user.
   */
  async create(dto: CreateUserDto) {
    const password = await bcrypt.hash(dto.password, await bcrypt.genSalt(10));
    const user = await this.userModel.create({ ...dto, password });
    return user;
  }

  /**
   * Saves the access token for the user with the given ID.
   * @param accessToken The access token to save.
   * @param userId The ID of the user to save the access token.
   * @throws UnauthorizedException If no user with the given ID exists.
   */
  async saveAcessToken(accessToken: string | null, userId: Types.ObjectId) {
    const res = await this.userModel.findByIdAndUpdate(userId, {
      accessToken,
      accessTokenWillExpireAt: Date.now() + 20 * 60 * 1000,
    });
    if (!res) throw new UnauthorizedException('user not exists');
  }

  /**
   * Retrieves the balance of the user with the given phone number.
   * @param phoneNumber The phone number of the user whose balance should be retrieved.
   * @returns The balance of the user.
   */
  async getUserBalance(phoneNumber: string) {
    const user = await this.userModel.findOne({ phoneNumber }).select({
      balance: 1,
    });
    return user.balance;
  }

  /**

    Reduces the balance of a user with the given phone number by the given amount
    @param phoneNumber - phone number of the user whose balance will be reduced
    @param ammount - amount to be reduced from the user's balance
    @throws BadRequestException if the user does not have enough balance to perform the operation
    @returns void
    */
  async reduceBalance(phoneNumber: string, ammount: number) {
    const user = await this.getUserByPhoneNumber(phoneNumber);
    if (user.balance < ammount)
      throw new BadRequestException('not enough balance to do the operation');
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        $inc: { balance: -ammount },
      },
      { new: true },
    );
    if (updatedUser.balance < 0) {
      await this.userModel.findByIdAndUpdate(
        user._id,
        {
          $inc: { balance: ammount },
        },
        { new: true },
      );
      throw new BadRequestException('not enough balance to do the operation');
    }
  }
  /**
    Transfers the given amount of balance from the sender to the receiver
    @param senderPhone - phone number of the sender
    @param receiverPhone - phone number of the receiver
    @param ammount - amount of balance to be transferred
    @throws BadRequestException if the sender does not have enough balance to perform the operation or if the transaction fails for any other reason
    @returns void
    */
  async moveBalance(
    senderPhone: string,
    receiverPhone: string,
    ammount: number,
  ) {
    // find user with senderPhoneNumber or reciever phoneNumber
    const [sender, reciever] = await Promise.all([
      this.getUserByPhoneNumber(senderPhone),
      this.getUserByPhoneNumber(receiverPhone),
    ]);
    if (sender.balance < ammount) {
      throw new BadRequestException('not enough balance to do the operation');
    }
    const res = await Promise.all([
      this.userModel.findByIdAndUpdate(sender._id, {
        $inc: { balance: -ammount },
      }),
      this.userModel.findByIdAndUpdate(reciever._id, {
        $inc: { balance: ammount },
      }),
    ]);
    if (res[0] === null && res[1] === null) {
      throw new BadRequestException('transaciton failed!');
    }
    if (res[0] === null) {
      await this.userModel.findByIdAndUpdate(reciever._id, {
        $inc: { balance: -ammount },
      });
      throw new BadRequestException('transaciton failed!');
    }
    if (res[1] === null) {
      await this.userModel.findByIdAndUpdate(sender._id, {
        $inc: { balance: ammount },
      });
      throw new BadRequestException('transaciton failed!');
    }
  }

  /**
   * Retrieves the children of the user with the given phone number.
   * @param phoneNumber The phone number of the user whose children should be retrieved.
   * @returns The children of the user.
   * @throws NotFoundException If no user with the given phone number exists.
   * @throws UnauthorizedException If the user with the given phone number is not a parent.
   */
  getChildren(phoneNumber: string) {
    return this.userModel.find({ parentPhoneNumber: phoneNumber }).select({
      phoneNumber: 1,
      name: 1,
    });
  }

  /**
   * Saves the OTP code and its expiration time for the user with the provided phone number.
   *
   * @param phoneNumber - The phone number of the user.
   * @param otp - The OTP code to be saved.
   *
   * @returns A Promise that resolves to the updated user object with the OTP and its expiration time.
   * @throws NotFoundException if the user with the provided phone number is not found.
   */

  saveOTP(phoneNumber: string, otp: string) {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { otp, otpWillExpireAt: Date.now() + 5 * 60 * 1000 },
    );
  }

  /**
   * Verifies the OTP code sent by the user and its expiration time.
   *
   * @param dto - An object containing the user's phone number and the OTP code to verify.
   *
   * @returns A Promise that resolves to an object containing a success status if the OTP is valid.
   * @throws NotFoundException if the user with the provided phone number is not found.
   * @throws UnauthorizedException if the OTP is invalid or expired.
   */

  async verifyOTP(dto: VerifyOTPDto) {
    const user = await this.userModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.otp !== dto.otp || user.otpWillExpireAt < Date.now())
      throw new UnauthorizedException('invalid otp');
    return { status: 'success' };
  }

  /**
   * Resets the user's password after verifying the provided OTP code.
   *
   * @param dto - An object containing the user's phone number, the new password and the OTP code to verify.
   *
   * @returns A Promise that resolves to an object containing a success status if the password reset is successful.
   * @throws NotFoundException if the user with the provided phone number is not found.
   * @throws UnauthorizedException if the OTP is invalid or expired.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.otp !== dto.otp || user.otpWillExpireAt < Date.now())
      throw new UnauthorizedException('invalid otp');
    const password = await bcrypt.hash(
      dto.newPassword,
      await bcrypt.genSalt(10),
    );
    await this.userModel.findByIdAndUpdate(user._id, {
      password,
      otp: null,
      otpWillExpireAt: null,
      accessToken: null,
      accessTokenWillExpireAt: null,
    });
    return { status: 'success' };
  }
  /**
   * Adds a list of categories to the set of forbidden categories of the user with the given phone number.
   * @param phoneNumber The phone number of the user whose forbidden categories should be updated.
   * @param categories The list of categories to add to the set of forbidden categories.
   * @returns The updated set of forbidden categories.
   */
  async addForbiddenCategories(phoneNumber: string, categories: string[]) {
    return this.userModel
      .findOneAndUpdate(
        { phoneNumber },
        { $addToSet: { forbiddenCategories: { $each: categories } } },
        { new: true },
      )
      .select({ forbiddenCategories: 1 });
  }

  /**
   * Adds a list of categories to the set of forbidden categories of the user with the given phone number.
   * @param phoneNumber The phone number of the user whose forbidden categories should be updated.
   * @param categories The list of categories to add to the set of forbidden categories.
   * @returns The updated set of forbidden categories.
   */
  async getForbiddenCategories(phoneNumber: string) {
    return this.userModel
      .findOne({ phoneNumber })
      .select({ forbiddenCategories: 1 });
  }
}
