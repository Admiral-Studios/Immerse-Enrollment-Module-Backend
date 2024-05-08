import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUsedCouponDto {
  @Expose()
  couponId: string;

  @Expose({ name: 'email' })
  userEmail: string;

  @Expose({ name: 'firstName' })
  userFirstName: string;

  @Expose({ name: 'lastName' })
  userLastName: string;
}
