import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuyUsingVirtualCardDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'food' })
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'pizza' })
  product: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1234567890123456' })
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123' })
  cvv: string;
}
