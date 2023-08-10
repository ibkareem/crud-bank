import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../transactions/transaction.model';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async createTransaction(data: TransactionDto) {
    const transaction = new this.transactionModel(data);
    return transaction.save();
  }

  async userBalance(userId: string): Promise<number> {
    const pipeline = [
      {
        $match: {
          userId: userId.toString(), // Replace with the actual user ObjectId
        },
      },
      {
        $group: {
          _id: null,
          totalCredits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0],
            },
          },
          totalDebits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          balance: {
            $subtract: ['$totalCredits', '$totalDebits'],
          },
        },
      },
    ];

    const result = await this.transactionModel.aggregate(pipeline).exec();

    if (result.length > 0) {
      return result[0].balance;
    } else {
      return 0; // If no transactions found, assume zero balance
    }
  }

  async transactionHistory(userId: string) {
    const history = await this.transactionModel
      .aggregate([
        {
          $match: {
            userId: userId.toString(),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      .exec();

    return history;
  }
}
