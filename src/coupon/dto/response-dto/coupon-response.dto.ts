import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CouponResponseDto {
  @Expose()
  id: string;
  @Expose()
  amount?: number;
  @Expose()
  description?: string;
  @Expose()
  discountType?: string;
  @Expose()
  expiryDate?: Date;
  @Expose()
  maximalSpend?: number;
  @Expose()
  minimalSpend?: number;
  @Expose()
  productCategory: string[];
  @Expose()
  productType: string[];
  @Expose()
  title: string;
  @Expose()
  usageLimitPerCoupon: number;
  @Expose()
  usageLimitPerUser: number;
}
