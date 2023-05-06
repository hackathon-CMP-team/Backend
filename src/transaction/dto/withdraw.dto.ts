import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WithdrawDto {
  @IsNumber()
  @ApiProperty({ description: 'amount of money to withdraw' })
  amount: number;
}
