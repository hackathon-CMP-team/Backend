import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { VirtualCardDto } from './dto/virtual-card.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import {
  TransactionTransfer,
  Transaction,
  TransactionWithdraw,
  TransactionVirtualVisa,
} from './transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(TransactionTransfer.name)
    private readonly transactionTransferModel: Model<TransactionTransfer>,
    @InjectModel(TransactionWithdraw.name)
    private readonly transactionWithdrawModel: Model<TransactionWithdraw>,
    @InjectModel(TransactionVirtualVisa.name)
    private readonly transactionVirtualVisaModel: Model<TransactionVirtualVisa>,
    private readonly userService: UserService,
  ) {}

  async transfer(
    senderPhone: string,
    receiverPhone: string,
    amount: number,
  ): Promise<any> {
    await this.userService.moveBalance(senderPhone, receiverPhone, amount);
    await this.transactionTransferModel.create({
      userPhone: senderPhone,
      receiverPhone,
      amount,
      date: Date.now(),
    });
    return { status: 'success' };
  }

  // card is a 16 digit number
  // it must be unique and random
  private generateCardNumber() {
    let cardNumber = '';
    for (let i = 0; i < 4; i++) {
      cardNumber += Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    }
    return cardNumber;
  }
  private generateCVV() {
    return Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
  }
  async createVirtualCard(phoneNumber: string, dto: VirtualCardDto) {
    await this.userService.reduceBalance(phoneNumber, dto.amount);
    const cardNumber = this.generateCardNumber();
    const cvv = this.generateCVV();
    this.transactionVirtualVisaModel.create({
      userPhone: phoneNumber,
      cardNumber,
      cvv,
      amount: dto.amount,
      date: Date.now(),
    });
    return { cardNumber, cvv };
  }

  async withdraw(phoneNumber: string, dto: WithdrawDto) {
    await this.userService.reduceBalance(phoneNumber, dto.amount);
    await this.transactionWithdrawModel.create({
      userPhone: phoneNumber,
      amount: dto.amount,
      date: Date.now(),
    });
    return { status: 'success' };
  }

  getUserTransactions(phoneNumber: string) {
    return this.transactionModel
      .find({
        $or: [{ userPhone: phoneNumber }, { receiverPhone: phoneNumber }],
      })
      .select({
        type: 1,
        amount: 1,
        date: 1,
        userPhone: 1,
        receiverPhone: 1,
      });
  }
}
