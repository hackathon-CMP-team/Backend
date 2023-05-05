import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ discriminatorKey: 'type' })
export class Transaction {
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  userPhone: string;
}

@Schema()
export class TransactionTransfer extends Transaction {
  @Prop({ required: true })
  receiverPhone: string;
}

@Schema()
export class TransactionVirtualVisa extends Transaction {
  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  cvv: number;
}

@Schema()
export class TransactionWithdraw extends Transaction {}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export const TransactionTransferSchema =
  SchemaFactory.createForClass(TransactionTransfer);
export const TransactionVirtualVisaSchema = SchemaFactory.createForClass(
  TransactionVirtualVisa,
);
export const TransactionWithdrawSchema =
  SchemaFactory.createForClass(TransactionWithdraw);
