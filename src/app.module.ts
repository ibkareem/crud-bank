import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './users/user/user.controller';
import { UserService } from './users/user/user.service';
import { User, UserSchema } from './users/user/user.model'; // Import the user model and schema
import { AuthService } from './auth/auth.service';
import { TransactionService } from './transactions/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from './transactions/transaction.model';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://decagon:decagon@cluster0.cocewbr.mongodb.net/veegil?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    AuthService,
    JwtStrategy,
    TransactionService,
  ],
})
export class AppModule {}
