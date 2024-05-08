import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CompletedOrderBillingAddress {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  firstLineAddress: string;

  @Expose()
  secondLineAddress: string;

  @Expose()
  city: string;

  @Expose()
  province: string;

  @Expose()
  country: string;

  @Expose()
  postcode: string;

  @Expose()
  email: string;
}
