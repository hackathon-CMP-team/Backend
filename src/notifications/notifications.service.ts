import { Injectable } from '@nestjs/common';
import { ChildrenService } from 'src/children/children.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    private readonly childrenService: ChildrenService,
  ) {}
  getMyNotifications(phoneNumber: string) {
    return this.transactionService.getNotificationOf(phoneNumber);
  }
}
