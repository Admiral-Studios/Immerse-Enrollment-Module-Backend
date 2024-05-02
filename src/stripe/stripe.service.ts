import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentPlatformService } from '../payment/abstractions/payment-platform.service';
import { OrderFull } from '../dal/order/entity-types/order-full.type';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentResponseType } from '../payment/types/create-payment-response.type';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { EntityManager } from '../dal/entity-manager';

@Injectable()
export class StripeService implements PaymentPlatformService {
  private readonly summerSchoolStripe: Stripe;
  private readonly educationalServicesStripe: Stripe;
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {
    this.summerSchoolStripe = new Stripe(
      process.env.SUMMER_SCHOOL_STRIPE_SECRET_KEY,
      {
        apiVersion: '2022-11-15',
      },
    );

    this.educationalServicesStripe = new Stripe(
      process.env.EDUCATIONAL_SERVICES_STRIPE_SECRET_KEY,
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async createPayment(
    order: OrderFull,
    onlinePrice: number,
    inPersonPrice: number,
  ): Promise<CreatePaymentResponseType> {
    const paymentInformation =
      await this.entityManager.orderRepository.getPaymentInformationOfOrder(
        order.id,
      );
    const sessionId = paymentInformation.stripeCheckoutSessionId;
    if (sessionId) {
      await this.summerSchoolStripe.checkout.sessions.expire(sessionId);
    }
    const session = await this.summerSchoolStripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Order',
            },
            unit_amount: (onlinePrice + inPersonPrice) * 100,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      mode: 'payment',
      customer_email: order.billingAddress.email,
      success_url: `${this.configService.get<string>(
        'PAYMENT_SUCCESS_URL',
      )}?orderId=${order.id}`,
      payment_intent_data: {
        transfer_group: `TRANSFER GROUP: ${order.id}`,
      },
    });

    return {
      url: session.url,
      stripeCheckoutSessionId: session.id,
      paymentType: 'stripe',
    };
  }

  public async sendTransfer(
    checkoutSessionId: string,
    onlinePrice: number,
    inPersonPrice: number,
    orderId: string,
    stripeTransferCompleted: boolean,
  ) {
    console.log('online price: ' + onlinePrice);
    console.log('in-person price: ' + inPersonPrice);
    const session = await this.summerSchoolStripe.checkout.sessions.retrieve(
      checkoutSessionId,
      { expand: ['payment_intent'] },
    );
    const charge = await this.summerSchoolStripe.charges.retrieve(
      (session.payment_intent as Stripe.PaymentIntent).latest_charge as string,
      {
        expand: ['balance_transaction'],
      },
    );

    const transfers = await this.summerSchoolStripe.transfers.list({
      transfer_group: `TRANSFER GROUP: ${orderId}`,
    });

    if (stripeTransferCompleted || transfers.data.length > 0) {
      return;
    }

    const fee =
      (charge.balance_transaction as Stripe.BalanceTransaction).fee / 100;
    const totalPrice = onlinePrice + inPersonPrice;
    const feeOnlineAmount = (onlinePrice / totalPrice) * fee;

    console.log('fee total amount: ' + fee);
    console.log('fee online amount: ' + feeOnlineAmount);
    const transfer = await this.summerSchoolStripe.transfers.create({
      destination: (
        await this.educationalServicesStripe.accounts.retrieve()
      ).id,
      amount: Math.round((onlinePrice - feeOnlineAmount) * 100),
      currency: 'gbp',
      source_transaction: charge.id,
      transfer_group: `TRANSFER GROUP: ${orderId}`,
    });
    await this.entityManager.orderRepository.updatePaymentInformationOfOrder(
      orderId,
      {
        stripeTransferCompleted: true,
      },
    );
    return transfer;
  }

  public async getWebhookEvent(
    body,
    signature: string | string[],
    endpointSecret: string,
  ): Promise<Stripe.Event> {
    try {
      return await this.summerSchoolStripe.webhooks.constructEvent(
        body,
        signature,
        endpointSecret,
      );
    } catch (e) {
      throw new BadRequestException(
        'Webhook signature verification failed. ' + e.message,
      );
    }
  }
}
