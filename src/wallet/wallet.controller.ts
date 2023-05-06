import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTUserGuard } from '../auth/guards/user.guard';
import { WalletService } from './wallet.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReturnedBalanceDto } from './dto/returned-balance.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get total balance of the user' })
  @ApiOkResponse({
    description: 'Balance of the user',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({ description: 'you are not authorized' })
  @Get('balance')
  @UseGuards(JWTUserGuard)
  getBalance(@Req() req: any): Promise<any> {
    return this.walletService.getBalance(req.user.phoneNumber);
  }

  @ApiOperation({ summary: 'Get total income of the user' })
  @ApiOkResponse({
    description: 'Income of the user',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({ description: 'you are not authorized' })
  @Get('income')
  @UseGuards(JWTUserGuard)
  getIncome(@Req() req: any): Promise<any> {
    return this.walletService.getIncome(req.user.phoneNumber);
  }

  @ApiOperation({ summary: 'Get total outcome of the user' })
  @ApiOkResponse({
    description: 'Outcome of the user',
    type: ReturnedBalanceDto,
  })
  @ApiUnauthorizedResponse({ description: 'you are not authorized' })
  @Get('outcome')
  @UseGuards(JWTUserGuard)
  getOutcome(@Req() req: any): Promise<any> {
    return this.walletService.getOutcome(req.user.phoneNumber);
  }
}
