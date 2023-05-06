import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VirtualCardDto {
  @IsNumber()
  @ApiProperty({ description: 'amount of money to transfer' })
  amount: number;
}
