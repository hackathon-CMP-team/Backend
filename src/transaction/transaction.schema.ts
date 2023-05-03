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

export class TransactionTransfer extends Transaction {
  @Prop({ required: true })
  to: Types.ObjectId;
}

export class TransactionVirtualVisa extends Transaction {
  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  cvv: number;
}

export class TransactionWithdraw extends Transaction {}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export const TransactionTransferSchema =
  SchemaFactory.createForClass(TransactionTransfer);
export const TransactionVirtualVisaSchema = SchemaFactory.createForClass(
  TransactionVirtualVisa,
);
export const TransactionWithdrawSchema =
  SchemaFactory.createForClass(TransactionWithdraw);
