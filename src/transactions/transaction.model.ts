import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  // Example method
  //   getFullName() {
  //     return `${this.firstName} ${this.lastName}`;
  //   }
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
