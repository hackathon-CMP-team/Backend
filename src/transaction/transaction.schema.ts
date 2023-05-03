import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ required: true, enum: ['withdraw', 'transfer', 'virtual visa'] })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export class TransictionTransfer extends Transaction {
  @Prop({ required: true })
  to: Types.ObjectId;
}

export class TransictionVirtualVisa extends Transaction {
  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  cvv: number;
}

export class TransictionWithdraw extends Transaction {}

export const TransactionScheme = SchemaFactory.createForClass(Transaction);
export const TransictionTransferScheme =
  SchemaFactory.createForClass(TransictionTransfer);
export const TransictionVirtualVisaScheme = SchemaFactory.createForClass(
  TransictionVirtualVisa,
);
export const TransictionWithdrawScheme =
  SchemaFactory.createForClass(TransictionWithdraw);
