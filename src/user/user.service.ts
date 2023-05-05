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

  async moveBalance(
    senderPhone: string,
    receiverPhone: string,
    ammount: number,
  ) {
    // find user with senderPhoneNumber or reciever phoneNumber
    try {
      const [sender, reciever] = await Promise.all([
        this.userModel.findOne({ phoneNumber: senderPhone }),
        this.userModel.findOne({ phoneNumber: receiverPhone }),
      ]);
      if (!reciever) {
        throw new NotFoundException(
          "wrong phone number, reciever doesn't exist",
        );
      }
      if (sender.balance < ammount) {
        throw new NotFoundException('not enugh balance to do the operation');
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
    } catch (err) {
      console.log(err);
    }
  }
}
