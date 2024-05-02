import { OrderFull } from '../../dal/order/entity-types/order-full.type';
import { CreatePaymentResponseType } from '../types/create-payment-response.type';

export abstract class PaymentPlatformService {
  abstract createPayment(
    order: OrderFull,
    onlinePrice: number,
    inPerson: number,
    invoiceNumber: number,
  ): Promise<CreatePaymentResponseType>;
}
