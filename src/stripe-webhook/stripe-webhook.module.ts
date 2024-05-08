import { Module } from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { OrderModule } from '../order/order.module';
import { DalModule } from '../dal/dal.module';
import { StripeModule } from '../stripe/stripe.module';
import { ProductModule } from '../product/product.module';
import { StripeEventService } from './stripe-event.service';

@Module({
  imports: [OrderModule, DalModule, StripeModule, ProductModule],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, StripeEventService],
})
export class StripeWebhookModule {}
