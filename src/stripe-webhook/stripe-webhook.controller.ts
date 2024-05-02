import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { WebhookEventInterceptor } from './interceptors/webhook-event.interceptor';

@Controller('stripe-webhook')
@UseInterceptors(WebhookEventInterceptor)
export class StripeWebhookController {
  @Post()
  webhook() {
    return 'success';
  }
}
