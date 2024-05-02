import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CompletedOrderPaymentInfo {
  @Expose()
  stripeCheckoutSessionId: string;

  @Expose()
  flywirePaymentId: string;

  @Expose()
  flywirePaymentStatus: string;

  @Expose()
  isConfirmed: boolean;

  @Expose()
  invoiceNumber: number;
}
