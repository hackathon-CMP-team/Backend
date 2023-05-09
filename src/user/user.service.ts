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
  async addForbiddenCategories(phoneNumber: string, categories: string[]) {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { $addToSet: { forbiddenCategories: { $each: categories } } },
    );
  }

  async getForbiddenCategories(phoneNumber: string) {
    return this.userModel
      .findOne({ phoneNumber })
      .select({ forbiddenCategories: 1 });
  }
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) throw new NotFoundException('phone number not exists');
    return user;
  }
  async create(dto: CreateUserDto) {
    const password = await bcrypt.hash(dto.password, await bcrypt.genSalt(10));
    const user = await this.userModel.create({ ...dto, password });
    return user;
  }

  async saveAcessToken(accessToken: string | null, userId: Types.ObjectId) {
    const res = await this.userModel.findByIdAndUpdate(userId, {
      accessToken,
      accessTokenWillExpireAt: Date.now() + 20 * 60 * 1000,
    });
    if (!res) throw new UnauthorizedException('user not exists');
  }

  async getUserBalance(phoneNumber: string) {
    const user = await this.userModel.findOne({ phoneNumber }).select({
      balance: 1,
    });
    return user.balance;
  }

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

  getChildren(phoneNumber: string) {
    return this.userModel.find({ parentPhoneNumber: phoneNumber }).select({
      phoneNumber: 1,
      name: 1,
    });
  }

  saveOTP(phoneNumber: string, otp: string) {
    return this.userModel.findOneAndUpdate(
      { phoneNumber },
      { otp, otpWillExpireAt: Date.now() + 5 * 60 * 1000 },
    );
  }

  async verifyOTP(dto: VerifyOTPDto) {
    const user = await this.userModel.findOne({
      phoneNumber: dto.phoneNumber,
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.otp !== dto.otp || user.otpWillExpireAt < Date.now())
      throw new UnauthorizedException('invalid otp');
    return { status: 'success' };
  }

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
}
