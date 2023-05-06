import { ApiProperty } from '@nestjs/swagger';
export class ReturnedBalanceDto {
  @ApiProperty({ description: 'Balance of the user' })
  balance: number;
}
