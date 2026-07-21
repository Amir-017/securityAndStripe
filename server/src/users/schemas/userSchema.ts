
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  password?: string;

  @Prop()
  picture?: string;

  @Prop({ default: 'local' })
  provider?: string;

  @Prop()
  googleId?: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);