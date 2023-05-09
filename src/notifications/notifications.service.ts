import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly transactionService: TransactionService) {}
  /**
   * get my notifications
   * @param phoneNumber phone number of the user
   * @returns some transactions related to the user or his children
   */
  getMyNotifications(phoneNumber: string) {
    return this.transactionService.getNotificationOf(phoneNumber);
  }
}
