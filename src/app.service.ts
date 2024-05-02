import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This was pushed here with Continuous Delivery!';
  }
}
