import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  // Add more fields as needed

  // Example method
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getAccountNumber() {
    if (!this.phone) {
      throw new Error('Phone number not available.');
    }

    // Remove the first digit from the phone number
    const accountNumber = this.phone.substring(1);

    return accountNumber;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
