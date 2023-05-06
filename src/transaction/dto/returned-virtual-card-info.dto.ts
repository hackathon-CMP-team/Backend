import { ApiProperty } from '@nestjs/swagger';

export class ReturnedVirtualCardInfoDto {
  @ApiProperty({ description: 'card number' })
  carNumber: string;
  @ApiProperty({ description: 'cvv of the card' })
  cvv: string;
}
