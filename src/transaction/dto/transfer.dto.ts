import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  ValidateBy,
} from 'class-validator';
import { Types } from 'mongoose';

export class TransferDto {
  @ApiProperty({ description: 'phone number of the receiver' })
  @IsString()
  receiverPhone: string;

  // todo: check if integer
  @ApiProperty({ description: 'amount of money to transfer' })
  @IsNumber()
  @ValidateBy({
    name: 'isPositiveInteger',
    validator: {
      validate: (value: number) => {
        return Number.isInteger(value) && value > 0;
      },
      defaultMessage: (args) => {
        return `amount ${args.value} is not valid, it must be a positive integer`;
      },
    },
  })
  @Max(10_000)
  amount: number;
}
