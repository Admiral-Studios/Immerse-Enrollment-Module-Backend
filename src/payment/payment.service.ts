import { Injectable } from '@nestjs/common';
import { FlywireService } from '../flywire/services/flywire.service';
import { StripeService } from '../stripe/stripe.service';
import { PaymentPlatformService } from './abstractions/payment-platform.service';
import { OrderFull } from '../dal/order/entity-types/order-full.type';
import { ProductFilterService } from '../product/services/product-filter.service';
import { CreatePaymentResponseType } from './types/create-payment-response.type';

@Injectable()
export class PaymentService {
  constructor(
    private readonly flywireService: FlywireService,
    private readonly stripeService: StripeService,
    private readonly productFilterService: ProductFilterService,
  ) {}

  async createPaymentForOrder(
    order: OrderFull,
    isDeposit: boolean,
    invoiceNumber: number,
  ): Promise<CreatePaymentResponseType> {
    const { service, onlinePrice, inPersonPrice } =
      await this.getPaymentService(order, isDeposit);
    return await service.createPayment(
      order,
      onlinePrice,
      inPersonPrice,
      invoiceNumber,
    );
  }

  private async getPaymentService(
    order: OrderFull,
    isDeposit: boolean,
  ): Promise<{
    service: PaymentPlatformService;
    onlinePrice: number;
    inPersonPrice: number;
  }> {
    const { onlinePrice, inPersonPrice } =
      await this.productFilterService.countProductOrdersOnlineAndInPersonPrices(
        order.productOrders,
        isDeposit,
      );

    let service =
      onlinePrice > 0 && inPersonPrice > 0
        ? this.stripeService
        : this.flywireService;

    return { service, onlinePrice, inPersonPrice };
  }
}
