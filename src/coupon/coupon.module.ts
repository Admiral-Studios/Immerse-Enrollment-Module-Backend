import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { DalModule } from '../dal/dal.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DalModule, HttpModule],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
