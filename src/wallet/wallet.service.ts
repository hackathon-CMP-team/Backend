import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}
  async getBalance(phoneNumber: string) {
    const [userBalance, unusedBalance] = await Promise.all([
      this.userService.getUserBalance(phoneNumber),
      this.transactionService.getReturnedBalance(phoneNumber),
    ]);
    return {
      total: userBalance + unusedBalance,
    };
  }
  async getIncome(phoneNumber: any): Promise<any> {
    const totalIncome = await this.transactionService.getIncome(phoneNumber);
    return { total: totalIncome };
  }

  async getOutcome(phoneNumber: any): Promise<any> {
    const totalOutcome = await this.transactionService.getOutcome(phoneNumber);
    return { total: totalOutcome };
  }
}
