export interface CreatePaymentResponseType {
  paymentType: 'stripe' | 'flywire';
  url?: string;
  token?: string;
  stripeCheckoutSessionId?: string;
}
