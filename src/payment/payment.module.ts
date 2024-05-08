import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { FlywireModule } from '../flywire/flywire.module';
import { StripeModule } from '../stripe/stripe.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [FlywireModule, StripeModule, ProductModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
