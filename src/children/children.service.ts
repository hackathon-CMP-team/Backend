import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { ChildInfoDto } from './dto/child-info.dto';
import { WalletService } from '../wallet/wallet.service';
import { ForbiddenCategoriesDto } from './dto/forbidden-categries.dto';
import { UserDocument } from '../user/user.schema';
import { Transaction } from 'mongodb';

@Injectable()
export class ChildrenService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}
  /**
    Validates the child user based on parent phone number and child phone number.
    Throws a NotFoundException if child user is not found or not associated with the parent phone number.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {string} childPhoneNumber - The phone number of the child user to be validated.
    @returns {Promise<UserDocument>} - The child user if found and associated with the parent phone number.
    @throws {NotFoundException} - If child user is not found or not associated with the parent phone number.
    */
  private async validateChild(
    phoneNumber: string,
    childPhoneNumber: string,
  ): Promise<UserDocument> {
    const child = await this.userService.getUserByPhoneNumber(childPhoneNumber);
    if (!child || child.parentPhoneNumber !== phoneNumber)
      throw new NotFoundException('child not found');
    return child;
  }
  /**
    Returns the transactions for a given child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ChildInfoDto} dto - DTO object containing the child phone number.
    @returns {Promise<Transaction[]>} - The transactions associated with the child user.
    */
  async getTransactions(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.transactionService.getUserTransactions(child.phoneNumber);
  }

  /**
    Returns the balance of a given child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ChildInfoDto} dto - DTO object containing the child phone number.
    @returns {Promise<{balance: number}>} - The balance of the child user.
    */
  async getBalance(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getBalance(child.phoneNumber);
  }
  /**
    Returns the income of a given child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ChildInfoDto} dto - DTO object containing the child phone number.
    @returns {Promise<{income: number}>} - The income of the child user.
    */
  async getIncome(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getIncome(child.phoneNumber);
  }

  /**
    Returns the outcome of a given child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ChildInfoDto} dto - DTO object containing the child phone number.
    @returns {Promise<{outcome: number}>} - The outcome of the child user.
    */
  async getOutcome(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.walletService.getOutcome(child.phoneNumber);
  }

  /**
    Returns the children associated with a given parent user.
    @param {string} phoneNumber - The phone number of the parent user.
    @returns {Promise<User[]>} - The children associated with the parent user.
    */
  async getChildren(phoneNumber: string) {
    return this.userService.getChildren(phoneNumber);
  }

  /**
    Adds forbidden categories to a child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ForbiddenCategoriesDto} dto - DTO object containing the child phone number and categories to be added.
    @returns {Promise<void>}
    */
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
  /**
    Returns the forbidden categories associated with a given child user.
    @param {string} phoneNumber - The phone number of the parent user.
    @param {ChildInfoDto} dto - DTO object containing the child phone number.
    @returns {Promise<string[]>} - The forbidden categories associated with the child user.
    */
  async getForbiddenCategories(phoneNumber: string, dto: ChildInfoDto) {
    const child = await this.validateChild(phoneNumber, dto.childPhoneNumber);
    return this.userService.getForbiddenCategories(child.phoneNumber);
  }
}
