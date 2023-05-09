import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
import * as bcrypt from 'bcrypt';

export enum UserRole {
  PARENT = 'parent',
  CHILD = 'child',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema()
export class User {
  @Prop({ default: 'parent', enum: UserRole })
  role: string;

  @Prop({ required: true, enum: UserGender })
  gender: string;

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

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ default: null })
  parentPhoneNumber: string;

  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  otpWillExpireAt: number;

  @Prop({})
  forbiddenCategories: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.comparePassword = async function (hashPassword: string) {
  return bcrypt.compare(hashPassword, this.password);
};
