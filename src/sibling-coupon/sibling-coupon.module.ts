import { Module } from '@nestjs/common';
import { DalModule } from '../dal/dal.module';
import { SiblingCouponService } from './sibling-coupon.service';

@Module({
  imports: [DalModule],
  exports: [SiblingCouponService],
  providers: [SiblingCouponService],
})
export class SiblingCouponModule {}
