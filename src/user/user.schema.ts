import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;
import * as bcrypt from 'bcrypt';
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  refreshToken: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.comparePassword = async function (hashPassword: string) {
  return bcrypt.compare(hashPassword, this.password);
};
