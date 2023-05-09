import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTUserGuard } from '../auth/guards/user.guard';
import { ReturnedTransactionDto } from '../transaction/dto/returned-transaction.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('notifications')
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
