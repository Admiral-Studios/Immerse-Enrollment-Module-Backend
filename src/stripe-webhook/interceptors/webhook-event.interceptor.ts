import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RawBodyRequest,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { StripeService } from '../../stripe/stripe.service';
import { StripeWebhookService } from '../stripe-webhook.service';
import { StripeEventService } from '../stripe-event.service';

@Injectable()
export class WebhookEventInterceptor implements NestInterceptor {
  public constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly stripeWebhookService: StripeWebhookService,
    private readonly stripeEventService: StripeEventService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request: RawBodyRequest<Request> = context
      .switchToHttp()
      .getRequest();
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    const signature = request.headers['stripe-signature'];
    const event = await this.stripeService.getWebhookEvent(
      request.rawBody,
      signature,
      endpointSecret,
    );

    const stripeEventExists = await this.stripeEventService.stripeEventExists(
      event.id,
    );
    if (stripeEventExists) {
      return next.handle().pipe();
    }

    const handler = this.getHandler(event.type) ?? this.getHandler('default');
    if (handler) {
      this.stripeWebhookService[handler](event.data.object);
      await this.stripeEventService.createStripeEvent(event.id);
      return next.handle().pipe();
    }

    throw new BadRequestException('Sth went wrong');
  }

  private getHandler(eventType: string): string | null {
    const handlers = StripeWebhookService.prototype;
    for (const methodName of Object.getOwnPropertyNames(handlers)) {
      const method = handlers[methodName];
      const event = Reflect.getMetadata('event', method);
      if (event === eventType) {
        return methodName;
      }
    }
    return null;
  }
}
