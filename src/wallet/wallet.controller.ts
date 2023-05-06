import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JWTUserGuard } from 'src/auth/guards/user.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @UseGuards(JWTUserGuard)
  getBalance(@Req() req: any) {
    return this.walletService.getBalance(req.user.phoneNumber);
  }
}
