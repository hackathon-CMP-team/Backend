import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Types } from 'mongoose';
import { UserRole } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { BuyUsingVirtualCardDto } from './dto/buy-using-vv.dto';
import { RequestMoneyDto } from './dto/request.dto';
import { ResponseToRequestDto } from './dto/resonse-to-request.dto';
import { VirtualCardDto } from './dto/virtual-card.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import {
  TransactionTransfer,
  Transaction,
  TransactionWithdraw,
  TransactionVirtualVisa,
  TransactionBuyUsingVirtualVisa,
  transactionRequestMoney,
  RequestMoneyStatus,
} from './transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(TransactionTransfer.name)
    private readonly transactionTransferModel: Model<TransactionTransfer>,
    @InjectModel(transactionRequestMoney.name)
    private readonly transactionRequestMoneyModel: Model<transactionRequestMoney>,
    @InjectModel(TransactionWithdraw.name)
    private readonly transactionWithdrawModel: Model<TransactionWithdraw>,
    @InjectModel(TransactionVirtualVisa.name)
    private readonly transactionVirtualVisaModel: Model<TransactionVirtualVisa>,
    @InjectModel(TransactionBuyUsingVirtualVisa.name)
    private readonly transactionBuyUsingVirtualVisaModel: Model<TransactionBuyUsingVirtualVisa>,
    private readonly userService: UserService,
  ) {}

  /**

    Transfers a given amount from one user's balance to another user's balance
    @param senderPhone - The phone number of the user sending the money
    @param receiverPhone - The phone number of the user receiving the money
    @param amount - The amount to be transferred
    @returns {Promise<{status: string}>}A Promise that resolves to an object with a status key and value of "success"
    */
  async transfer(
    senderPhone: string,
    receiverPhone: string,
    amount: number,
  ): Promise<{ status: string }> {
    await this.userService.moveBalance(senderPhone, receiverPhone, amount);
    await this.transactionTransferModel.create({
      userPhone: senderPhone,
      receiverPhone,
      amount,
      date: Date.now(),
    });
    return { status: 'success' };
  }

  /**

    Generates a random 16-digit card number
    @returns A string representing the randomly generated card number
    */
  private generateCardNumber() {
    let cardNumber = '';
    for (let i = 0; i < 4; i++) {
      cardNumber += Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
    }
    return cardNumber;
  }

  /**
    Generates a random 16-digit card number
    @returns A string representing the randomly generated card number
    */
  private generateCVV() {
    return Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
  }

  /**
    Buys a product using a virtual visa card
    @param dto - An object containing the required data to complete the purchase
    @returns {Promise<{status: string}>}A Promise that resolves to an object with a status key and value of "success"
    @throws BadRequestException if the card number or CVV are invalid, if the user is not allowed to buy the category of the product,
    if the card is expired or if the card has insufficient balance
    */
  async buyUsingVirtualCard(
    dto: BuyUsingVirtualCardDto,
  ): Promise<{ status: string }> {
    const { cardNumber, cvv, amount, category, product } = dto;
    const card = await this.transactionVirtualVisaModel.findOne({
      cardNumber,
      cvv,
    });
    if (!card) {
      throw new BadRequestException('Invalid card number or CVV');
    }

    const user = await this.userService.getUserByPhoneNumber(card.userPhone);
    if (category in user.forbiddenCategories) {
      throw new BadRequestException('user not allowed to buy this category');
    }

    if (card.visaWillExpireAt < Date.now()) {
      throw new BadRequestException('Card expired');
    }

    if (card.usedAmount + amount > card.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const updatedOne = await this.transactionVirtualVisaModel.findOneAndUpdate(
      { cardNumber, cvv },
      { $inc: { usedAmount: amount } },
    );
    if (updatedOne.usedAmount > updatedOne.amount) {
      await this.transactionVirtualVisaModel.findOneAndUpdate(
        { cardNumber, cvv },
        { $inc: { usedAmount: -amount } },
      );
      throw new BadRequestException('Insufficient balance');
    }
    await this.transactionBuyUsingVirtualVisaModel.create({
      userPhone: card.userPhone,
      visaId: card._id,
      amount,
      category,
      product,
      date: Date.now(),
    });
    return { status: 'success' };
  }

  /**

    Creates a virtual Visa card for the user and adds the details to the virtual transaction model.
    @param phoneNumber The phone number of the user creating the virtual card.
    @param dto An object containing the amount to add to the virtual card.
    @returns An object containing the newly created card number and CVV code.
    */
  async createVirtualCard(phoneNumber: string, dto: VirtualCardDto) {
    await this.userService.reduceBalance(phoneNumber, dto.amount);
    const cardNumber = this.generateCardNumber();
    const cvv = this.generateCVV();
    await this.transactionVirtualVisaModel.create({
      userPhone: phoneNumber,
      cardNumber,
      cvv,
      amount: dto.amount,
      date: Date.now(),
    });
    return { cardNumber, cvv };
  }

  
  async sendVirtualCard(phoneNumber: string, dto: VirtualCardDto) {
    const { cardNumber, cvv } = await this.createVirtualCard(phoneNumber, dto);
    return { status: 'success' };
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
  async getIncome(phoneNumber: string): Promise<number> {
    const res = await this.transactionTransferModel.aggregate([
      {
        $match: {
          receiverPhone: phoneNumber,
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: '$amount' },
        },
      },
    ]);
    return res.length ? res[0].total : 0;
  }

  async getOutcome(phoneNumber: string) {
    const res = await this.transactionModel.aggregate([
      {
        $match: {
          userPhone: phoneNumber,
        },
      },
      {
        $project: {
          amount: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$type', TransactionVirtualVisa.name] },
                  { $eq: ['$type', transactionRequestMoney.name] },
                ],
              },
              then: 0,
              else: '$amount',
            },
          },
        },
      },
      {
        $group: {
          _id: 1,
          totalOutcome: { $sum: '$amount' },
        },
      },
    ]);
    return res.length ? res[0].totalOutcome : 0;
  }
  selectSomeTransactions(condition: any) {
    return this.transactionModel.find(condition).select({
      type: 1,
      amount: 1,
      date: 1,
      userPhone: 1,
      receiverPhone: 1,
      usedAmount: 1,
      usedAt: 1,
      product: 1,
      categoty: 1,
    });
  }
  getUserTransactions(phoneNumber: string) {
    return this.selectSomeTransactions({
      $or: [{ userPhone: phoneNumber }, { receiverPhone: phoneNumber }],
    });
  }
  async getReturnedBalance(phoneNumber: string): Promise<number> {
    try {
      const res = await this.transactionVirtualVisaModel
        .find({
          userPhone: phoneNumber,
          unusedMoneyReturned: false,
          visaWillExpireAt: { $lte: Date.now() },
        })
        .select({
          amount: 1,
          usedAmount: 1,
          type: 0,
        });
      const returnedAmount = res.reduce(
        (acc, cur) => acc + cur.amount - cur.usedAmount,
        0,
      );
      const ids = res.map((transaction) => transaction._id);
      await this.userService.reduceBalance(phoneNumber, -returnedAmount);
      await this.transactionVirtualVisaModel.updateMany(
        { _id: { $in: ids } },
        { unusedMoneyReturned: true },
      );
      return returnedAmount;
    } catch (err) {
      throw new InternalServerErrorException(
        `Error in returning money : ${err.message}`,
      );
    }
  }

  async requestMoney(phoneNumber: string, dto: RequestMoneyDto) {
    const { amount, senderPhone } = dto;
    const user = await this.userService.getUserByPhoneNumber(dto.senderPhone);
    if (user?.role === UserRole.CHILD) {
      throw new BadRequestException('you cannot request money from a child');
    }
    await this.transactionRequestMoneyModel.create({
      userPhone: phoneNumber,
      senderPhone,
      amount,
      date: Date.now(),
    });
    return { status: 'success' };
  }

  async acceptRequest(phoneNumber: string, dto: ResponseToRequestDto) {
    const transaction =
      await this.transactionRequestMoneyModel.findOneAndUpdate(
        {
          _id: dto.requestId,
          senderPhone: phoneNumber,
          userPhone: dto.requesterPhone,
          status: RequestMoneyStatus.PENDING,
        },
        { status: RequestMoneyStatus.ACCEPTED },
      );
    if (!transaction) {
      throw new BadRequestException('Invalid request');
    }
    const { balance } = await this.userService.getUserByPhoneNumber(
      phoneNumber,
    );
    if (balance < transaction.amount) {
      await this.transactionRequestMoneyModel.findByIdAndUpdate(dto.requestId, {
        status: RequestMoneyStatus.REJECTED,
      });
      throw new BadRequestException(
        'Insufficient balance to accept the operation, request is rejected',
      );
    }
    await this.transfer(phoneNumber, dto.requesterPhone, transaction.amount);
    return { status: 'success' };
  }

  async rejectRequest(phoneNumber: string, dto: ResponseToRequestDto) {
    const transaction =
      await this.transactionRequestMoneyModel.findOneAndUpdate(
        {
          _id: dto.requestId,
          senderPhone: phoneNumber,
          userPhone: dto.requesterPhone,
          status: RequestMoneyStatus.PENDING,
        },
        { status: RequestMoneyStatus.REJECTED },
      );
    if (!transaction) {
      throw new BadRequestException('Invalid request');
    }
    return { status: 'success' };
  }

  async getNotificationOf(phoneNumber: string) {
    const childPhones = (await this.userService.getChildren(phoneNumber)).map(
      (child) => child.phoneNumber,
    );
    return this.selectSomeTransactions({
      $or: [
        { senderPhone: phoneNumber, status: RequestMoneyStatus.PENDING },
        { userPhone: { $in: childPhones } },
        { receiverPhone: { $in: childPhones } },
      ],
    });
  }
}
