import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class TransferDto {
  @IsString()
  receiverPhone: string;

  // todo: check if integer
  @IsNumber()
  amount: number;
}
