import { ApiProperty } from '@nestjs/swagger';

export class ReturnedTransactionDto {
  @ApiProperty({ example: 'TrnasactionTransfer' })
  type: string;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: '2021-05-01T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: '1033304427' })
  userPhone: string;

  @ApiProperty({ example: null })
  receiverPhone?: string | null;

  @ApiProperty({ example: 100 })
  usedAmount?: number | null;

  @ApiProperty({ example: '2021-05-01T00:00:00.000Z' })
  usedAt?: Date | null;

  @ApiProperty({ example: null })
  product?: string | null;

  @ApiProperty({ example: null })
  categoty?: string | null;
}
