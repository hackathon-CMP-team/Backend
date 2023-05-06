import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TransferDto {
  @ApiProperty({ description: 'phone number of the receiver' })
  @IsString()
  receiverPhone: string;

  // todo: check if integer
  @ApiProperty({ description: 'amount of money to transfer' })
  @IsNumber()
  amount: number;
}
