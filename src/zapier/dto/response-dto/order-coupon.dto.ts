import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderCoupon {
  @Expose()
  wordpressId: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  amount: number;

  @Expose()
  discountType: string;
}
