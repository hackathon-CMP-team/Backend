import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTParentGuard } from '../auth/guards/parent.guard';
import { JWTUserGuard } from '../auth/guards/user.guard';
import { BuyUsingVirtualCardDto } from './dto/buy-using-vv.dto';
import { RequestMoneyDto } from './dto/request.dto';
import { ResponseToRequestDto } from './dto/resonse-to-request.dto';
import { ReturnedTransactionDto } from './dto/returned-transaction.dto';
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
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is a child',
  })
  @ApiBadRequestResponse({ description: 'not enough balance' })
  @ApiNotFoundResponse({ description: 'receiver not found' })
  @ApiBearerAuth()
  @UseGuards(JWTParentGuard)
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
  @ApiBadRequestResponse({ description: 'not enough balance' })
  @ApiBearerAuth()
  @UseGuards(JWTUserGuard)
  @Post('virtual-card')
  createVirtualCard(@Req() req: any, @Body() dto: VirtualCardDto) {
    return this.transactionService.createVirtualCard(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'buy using virtual visa card' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiBadRequestResponse({
    description: 'not enough balance or wrong card number',
  })
  @Post('payment')
  buyUsingVirtualCard(@Body() dto: BuyUsingVirtualCardDto) {
    return this.transactionService.buyUsingVirtualCard(dto);
  }

  @ApiOperation({ summary: 'withdraw money from the wallet' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is a child',
  })
  @ApiBadRequestResponse({ description: 'not enough balance' })
  @ApiBearerAuth()
  @UseGuards(JWTParentGuard)
  @Post('withdraw')
  withdraw(@Req() req: any, @Body() dto: WithdrawDto) {
    return this.transactionService.withdraw(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get all transactions of the user' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: [ReturnedTransactionDto],
  })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @ApiBearerAuth()
  @UseGuards(JWTUserGuard)
  @Get('')
  getMyTransactions(@Req() req: any) {
    return this.transactionService.getUserTransactions(req.user.phoneNumber);
  }

  @ApiOperation({ summary: 'request money from another user' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiUnauthorizedResponse({ description: 'user not logged in' })
  @UseGuards(JWTUserGuard)
  @Post('request')
  requestMoney(@Req() req: any, @Body() dto: RequestMoneyDto) {
    return this.transactionService.requestMoney(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'accept request and transfer money to this user' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiBadRequestResponse({ description: 'invalid operation' })
  @ApiUnauthorizedResponse({
    description: 'user not logged in or user is a child',
  })
  @Post('request/accept')
  @UseGuards(JWTParentGuard)
  acceptRequest(@Req() req: any, @Body() dto: ResponseToRequestDto) {
    return this.transactionService.acceptRequest(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'reject request of transfering money to a user' })
  @ApiOkResponse({ description: 'operation successfully done' })
  @ApiBadRequestResponse({ description: 'invalid operation' })
  @ApiUnauthorizedResponse({
    description: 'user not logged in or user is a child',
  })
  @UseGuards(JWTParentGuard)
  @Post('request/reject')
  rejectRequest(@Req() req: any, @Body() dto: ResponseToRequestDto) {
    return this.transactionService.rejectRequest(req.user.phoneNumber, dto);
  }
}
