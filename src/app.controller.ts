import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Post('/signup')
  // signup(@Body() signupData: SignupDto) {
  //   this.appService.createUser(signupData);
  //   return {
  //     message: 'success',
  //   };
  // }
}
