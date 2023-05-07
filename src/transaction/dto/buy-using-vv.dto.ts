import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuyUsingVirtualCardDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  product: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cvv: string;
}
