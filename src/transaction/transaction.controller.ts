import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTUserGuard } from 'src/auth/guards/user.guard';
import { ReturnedVirtualCardInfoDto } from './dto/returned-virtual-card-info.dto';
import { TransferDto } from './dto/transfer.dto';
import { VirtualCardDto } from './dto/virtual-card.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransactionService } from './transaction.service';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'transfer money to another user' })
  @ApiOkResponse({ description: 'transfer successfully' })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @ApiBadRequestResponse({ description: 'not enugh balance' })
  @ApiNotFoundResponse({ description: 'receiver not found' })
  @UseGuards(JWTUserGuard)
  @Post('transfer')
  transfer(@Req() req: any, @Body() dto: TransferDto) {
    return this.transactionService.transfer(
      req.user.phoneNumber,
      dto.receiverPhone,
      dto.amount,
    );
  }

  @ApiOperation({ summary: 'create virtual visa card' })
  @ApiOkResponse({
    description: 'card successfully created',
    type: ReturnedVirtualCardInfoDto,
  })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @ApiBadRequestResponse({ description: 'not enugh balance' })
  @UseGuards(JWTUserGuard)
  @Post('virtual-card')
  createVirtualCard(@Req() req: any, @Body() dto: VirtualCardDto) {
    return this.transactionService.createVirtualCard(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'withdraw money from the wallet' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @ApiBadRequestResponse({ description: 'not enugh balance' })
  @UseGuards(JWTUserGuard)
  @Post('withdraw')
  withdraw(@Req() req: any, @Body() dto: WithdrawDto) {
    return this.transactionService.withdraw(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get all transactions of the user' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @UseGuards(JWTUserGuard)
  @Get('')
  getMyTransactions(@Req() req: any) {
    return this.transactionService.getUserTransactions(req.user.phoneNumber);
  }
}
