import { Injectable } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}
}
