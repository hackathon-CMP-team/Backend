import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JWTUserGuard } from 'src/auth/guards/user.guard';
import { TransferDto } from './dto/transfer.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  @UseGuards(JWTUserGuard)
  transfer(@Req() req: any, @Body() dto: TransferDto) {
    return this.transactionService.transfer(
      req.user.phoneNumber,
      dto.receiverPhone,
      dto.amount,
    );
  }
}
