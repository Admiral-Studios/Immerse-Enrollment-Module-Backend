import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [DalModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
