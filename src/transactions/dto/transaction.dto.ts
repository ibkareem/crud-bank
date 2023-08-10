import { ObjectId } from 'mongodb';

export enum TransactionType {
  Debit = 'debit',
  Credit = 'credit',
}

export class TransactionDto {
  amount: number;
  type: TransactionType;
  userId: ObjectId;
  description?: string; // Optional description for the transaction
}
