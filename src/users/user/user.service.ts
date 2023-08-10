import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.model';
import { TransactionType } from 'src/transactions/dto/transaction.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: any): Promise<User> {
    data.password = await this.hashPassword(data.password);
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async loginUser(data: any) {
    data = this.formatData(data);
    const user = await this.userExists(data);
    if (user && (await this.comparePasswords(data.password, user.password))) {
      user.password = null;
      return user;
    }
    return null;
  }

  async processDeposit(user, { amount }) {
    const type = TransactionType.Credit;
    const data = {
      type,
      userId: user._id,
      amount: Number(amount),
      description: 'Funds Deposit',
    };
    return data;
  }

  async processWithdrawal(user, { amount }) {
    const type = TransactionType.Debit;
    const data = {
      type,
      userId: user._id,
      amount: Number(amount),
      description: 'Funds Withdrawal',
    };
    return data;
  }

  formatData(data: any) {
    const { id, ...rest } = data;

    if (id && id.toString().length === 10) {
      rest.phone = '0' + id;
      return rest;
    }
    data.phone = data.id;
    return data;
  }

  async userExists(data) {
    const phone = typeof data.phone === 'undefined' ? data : data.phone;
    return await this.userModel.findOne({ phone: phone });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 5; // You can adjust the number of salt rounds
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    providedPassword: string,
    storedHashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedHashedPassword);
  }
}
