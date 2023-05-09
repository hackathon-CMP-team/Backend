import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTUserGuard } from 'src/auth/guards/user.guard';
import { ReturnedTransactionDto } from 'src/transaction/dto/returned-transaction.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    description:
      'get notfication of some user (request operations, and child operations)',
  })
  @ApiOkResponse({
    description: 'notifications returned successfully',
    type: [ReturnedTransactionDto],
  })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @UseGuards(JWTUserGuard)
  @Get('')
  getMyNotifications(@Req() req: any) {
    return this.notificationsService.getMyNotifications(req.user.phoneNumber);
  }
}
