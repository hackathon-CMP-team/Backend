import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, ValidateBy } from 'class-validator';

export class VirtualCardDto {
  @IsNumber()
  @ApiProperty({ description: 'amount of money to transfer' })
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
