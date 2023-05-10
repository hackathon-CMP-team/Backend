import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BillType } from '../transaction.schema';

export class PayBillDto {
  @ApiProperty({
    description: 'bill unique identifer (related to each payment)',
  })
  @IsString()
  billNumber: string;

  @ApiProperty({ description: 'amount of money to pay' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsEnum(BillType)
  @ApiProperty({ description: 'type of the bill' })
  billType: BillType;
}
