import { Prisma } from '@prisma/client';
import { couponFullInclude } from '../../coupon/entity-types/coupon-full.type';

export const usedCouponFullInclude =
  Prisma.validator<Prisma.UsedCouponInclude>()({
    coupon: { include: couponFullInclude },
  });

export type UsedCouponFull = Prisma.UsedCouponGetPayload<{
  include: typeof usedCouponFullInclude;
}>;
