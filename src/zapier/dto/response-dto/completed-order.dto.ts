import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { CompletedOrderBillingAddress } from './completed-order-billing-address.dto';
import { CompletedOrderPaymentInfo } from './completed-order-payment-info.dto';
import { UnfinishedOrderResponseDto } from './unfinished-order.dto';

@Exclude()
export class CompletedOrderResponseDto extends UnfinishedOrderResponseDto {
  @Expose()
  amountPaid: number;

  @Expose()
  isDeposit: boolean;

  @Expose()
  isBundle: boolean;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompletedOrderBillingAddress, JSON.parse(value)),
  )
  @Type(() => CompletedOrderBillingAddress)
  billingAddress: CompletedOrderBillingAddress;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(CompletedOrderPaymentInfo, JSON.parse(value)),
  )
  @Type(() => CompletedOrderPaymentInfo)
  paymentInformation: CompletedOrderPaymentInfo;
}
