import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  createUser(data) {
    console.log(data);
  }
  loginUser(data) {
    console.log(data);
  }
}
