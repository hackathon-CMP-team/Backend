import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTParentGuard } from 'src/auth/guards/parent.guard';
import { ReturnedTransactionDto } from 'src/transaction/dto/returned-transaction.dto';
import { ReturnedBalanceDto } from 'src/wallet/dto/returned-balance.dto';
import { ChildrenService } from './children.service';
import { ChildInfoDto } from './dto/child-info.dto';

@Controller('children')
@ApiTags('children')
@UseGuards(JWTParentGuard)
@ApiBearerAuth()
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @ApiOperation({ summary: 'get all transactions of a spcific child' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: [ReturnedTransactionDto],
  })
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is not a parent',
  })
  @ApiNotFoundResponse({ description: 'child not found' })
  @Get('transactions')
  getTransactions(@Req() req: any, @Body() dto: ChildInfoDto) {
    return this.childrenService.getTransactions(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get the balance of a spcific child' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is not a parent',
  })
  @ApiNotFoundResponse({ description: 'child not found' })
  @Get('balance')
  getBalance(@Req() req: any, @Body() dto: ChildInfoDto) {
    return this.childrenService.getBalance(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get the income of a spcific child' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is not a parent',
  })
  @ApiNotFoundResponse({ description: 'child not found' })
  @Get('income')
  getIncome(@Req() req: any, @Body() dto: ChildInfoDto) {
    return this.childrenService.getIncome(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get income of a spcific child' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({
    description: 'user not logged in, or user is not a parent',
  })
  @ApiNotFoundResponse({ description: 'child not found' })
  @Get('outcome')
  getOutcome(@Req() req: any, @Body() dto: ChildInfoDto) {
    return this.childrenService.getOutcome(req.user.phoneNumber, dto);
  }

  @ApiOperation({ summary: 'get all children of a spcific parent' })
  @ApiOkResponse({
    description: 'operation successfully done',
    type: [ChildInfoDto],
  })
  @Get('me')
  getChildren(@Req() req: any) {
    return this.childrenService.getChildren(req.user.phoneNumber);
  }
}
