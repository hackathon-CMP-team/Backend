import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
  @Prop({ default: 'parent', enum: ['parent', 'child'] })
  role: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  accessToken: string;

  // add 20 minitues to current time
  @Prop({ default: () => Date.now() + 20 * 60 * 1000 })
  accessTokenWillExpireAt: number;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: Date.now })
  dateOfBirh: Date;

  @Prop({ default: null })
  parentPhoneNumber: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.comparePassword = async function (hashPassword: string) {
  return bcrypt.compare(hashPassword, this.password);
};
