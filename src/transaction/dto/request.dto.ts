import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestMoneyDto {
  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  amount: number;
}
