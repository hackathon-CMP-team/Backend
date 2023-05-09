import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateBy,
} from 'class-validator';

export class RequestMoneyDto {
  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @ApiProperty({ example: 100 })
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
