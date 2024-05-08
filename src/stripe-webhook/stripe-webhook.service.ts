import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfirmOrderPaymentUseCase } from '../order/use-cases/confirm-order-payment.use-case';
import { EntityManager } from '../dal/entity-manager';
import { WebhookEvent } from './decorators/webhook-event.decorator';
import { StripeService } from '../stripe/stripe.service';
import { ProductFilterService } from '../product/services/product-filter.service';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly confirmOrderPaymentUseCase: ConfirmOrderPaymentUseCase,
    private readonly entityManager: EntityManager,
    private readonly stripeService: StripeService,
    private readonly productFilterService: ProductFilterService,
  ) {}

  @WebhookEvent('checkout.session.completed')
  async succeed(event: Stripe.Checkout.Session) {
    const order =
      await this.entityManager.orderRepository.findOrderByStripeCheckoutSessionId(
        event.id,
      );

    const paymentInformation =
      await this.entityManager.orderRepository.getPaymentInformationOfOrder(
        order.id,
      );

    if (!order) {
      throw new NotFoundException("Order doesn't exist");
    }

    const { onlinePrice, inPersonPrice } =
      await this.productFilterService.countProductOrdersOnlineAndInPersonPrices(
        order.productOrders,
        order.totalDepositAmount &&
          event.amount_total === order.totalDepositAmount * 100,
      );

    await this.stripeService.sendTransfer(
      event.id,
      onlinePrice,
      inPersonPrice,
      order.id,
      paymentInformation.stripeTransferCompleted,
    );

    return await this.confirmOrderPaymentUseCase.exec(
      order.id,
      event.amount_total,
    );
  }
}
