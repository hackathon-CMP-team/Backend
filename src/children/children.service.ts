import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { ChildInfoDto } from './dto/child-info.dto';
import { WalletService } from '../wallet/wallet.service';
import { ForbiddenCategoriesDto } from './dto/forbidden-categries.dto';

@Injectable()
export class ChildrenService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}
  private async validateChild(phoneNumber: string, childPhoneNumber: string) {
    const child = await this.userService.getUserByPhoneNumber(childPhoneNumber);
    if (!child || child.parentPhoneNumber !== phoneNumber)
      throw new NotFoundException('child not found');
    return child;
  }
  async getTransactions(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.transactionService.getUserTransactions(child.phoneNumber);
  }

  async getBalance(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getBalance(child.phoneNumber);
  }

  async getIncome(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getIncome(child.phoneNumber);
  }

  async getOutcome(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getOutcome(child.phoneNumber);
  }

  async getChildren(phoneNumber: string) {
    return this.userService.getChildren(phoneNumber);
  }

  async addForbiddenCategories(
    phoneNumber: string,
    dto: ForbiddenCategoriesDto,
  ) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.userService.addForbiddenCategories(
      child.phoneNumber,
      dto.categories,
    );
  }

  async getForbiddenCategories(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.userService.getForbiddenCategories(child.phoneNumber);
  }
}
