import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from './user.model';
import { GetUser } from 'src/decorators/get-user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { TransactionService } from 'src/transactions/transaction.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { DepositDto } from '../dto/deposit.dto';
import { WithdrawDto } from '../dto/withdraw.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
  ) {}

  @Post('/signup')
  async signup(@Body() signupData: SignupDto) {
    try {
      const createdUser = await this.userService.createUser(signupData);
      createdUser.password = null;
      return {
        message: 'success',
        user: createdUser,
      };
    } catch (error) {
      return {
        message: 'error',
        error: error.message,
      };
    }
  }

  @Post('/login')
  async login(@Body() loginData: LoginDto) {
    try {
      const user = await this.userService.loginUser(loginData);
      if (user) {
        const token = await this.authService.generateToken(user.phone);
        return {
          token: token,
        };
      }
      throw new Error('User not found');
    } catch (error) {
      return {
        message: 'error',
        error: error.message,
      };
    }
  }

  @Post('/deposit')
  @UseGuards(AuthGuard('jwt'))
  async deposit(@Body() amount: DepositDto, @GetUser() user: User) {
    const data = await this.userService.processDeposit(user, amount);
    const transaction = await this.transactionService.createTransaction(data);

    if (transaction) {
      return {
        message: 'Deposit successful',
        transactionId: transaction._id, // Include the transaction ID if needed
      };
    } else {
      return {
        message: 'Deposit failed',
      };
    }
  }

  @Post('/withdraw')
  @UseGuards(AuthGuard('jwt'))
  async withdraw(@Body() amount: WithdrawDto, @GetUser() user: User) {
    const { _id } = await this.userService.userExists(user);
    const withdrawAmount = Number(amount.amount);
    let balance = 0;
    if (_id) {
      balance = await this.transactionService.userBalance(_id);
    }

    if (balance >= withdrawAmount) {
      const data = await this.userService.processWithdrawal(user, amount);
      const transaction = await this.transactionService.createTransaction(data);
      if (transaction) {
        return {
          message: 'Withdrawal successful',
          transactionId: transaction._id, // Include the transaction ID if needed
        };
      } else {
        return {
          message: 'Withdrawal failed',
        };
      }
    } else {
      return {
        message: 'Insufficient funds',
      };
    }
  }

  @Get('/transactions')
  @UseGuards(AuthGuard('jwt'))
  async getTransactions(@GetUser() user: User) {
    const { _id } = await this.userService.userExists(user);
    if (_id) {
      const history = await this.transactionService.transactionHistory(_id);
      return {
        message: history,
      };
    } else {
      return {
        message: 'user not found',
      };
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@GetUser() user: User) {
    const { _id } = await this.userService.userExists(user);
    if (_id) {
      const balance = await this.transactionService.userBalance(_id.toString());
      const firstName = user.firstName;
      const lastName = user.lastName;
      const accountNumber = user.phone;
      return {
        data: { balance, firstName, lastName, accountNumber },
      };
    }
    return {
      data: 'user not found',
    };
  }
}
