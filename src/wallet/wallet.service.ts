import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';

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
      balance: userBalance + unusedBalance,
    };
  }
}
