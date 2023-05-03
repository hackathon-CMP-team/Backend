import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) throw new UnauthorizedException('phone number not exists');
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

  getUserBalance(user: UserDocument) {
    return { balance: user.balance };
  }
}
