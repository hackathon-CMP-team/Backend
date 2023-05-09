import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}
  /**
    Get the balance of a user by adding their current balance and unused balance.
    @param phoneNumber The phone number of the user whose balance is being fetched.
    @returns An object containing the total balance of the user.
    */
  async getBalance(phoneNumber: string) {
    const [userBalance, unusedBalance] = await Promise.all([
      this.userService.getUserBalance(phoneNumber),
      this.transactionService.getReturnedBalance(phoneNumber),
    ]);
    return {
      total: userBalance + unusedBalance,
    };
  }

  /**
    Get the total income of a user.
    @param phoneNumber The phone number of the user whose income is being fetched.
    @returns An object containing the total income of the user.
    */
  async getIncome(phoneNumber: any): Promise<any> {
    const totalIncome = await this.transactionService.getIncome(phoneNumber);
    return { total: totalIncome };
  }

  /**
    Get the total outcome of a user.
    @param phoneNumber The phone number of the user whose outcome is being fetched.
    @returns An object containing the total outcome of the user.
    */
  async getOutcome(phoneNumber: any): Promise<any> {
    const totalOutcome = await this.transactionService.getOutcome(phoneNumber);
    return { total: totalOutcome };
  }
}
