import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly transactionService: TransactionService) {}
  getMyNotifications(phoneNumber: string) {
    return this.transactionService.getNotificationOf(phoneNumber);
  }
}
