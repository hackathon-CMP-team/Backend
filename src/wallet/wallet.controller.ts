import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTUserGuard } from 'src/auth/guards/user.guard';
import { WalletService } from './wallet.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
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
  @Get('balance')
  @UseGuards(JWTUserGuard)
  getBalance(@Req() req: any): Promise<any> {
    return this.walletService.getBalance(req.user.phoneNumber);
  }
}
