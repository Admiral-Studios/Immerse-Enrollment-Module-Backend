import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from '../../dal/coupon/coupon.repository';

@Injectable()
export class CouponExistsGuard implements CanActivate {
  constructor(private readonly couponRepository: CouponRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const couponTitle = request.params?.coupon || request.body?.coupon;

    if (!request.locals) {
      request.locals = {};
    }

    request.locals.coupon = await this.couponRepository.findCouponByTitle(
      couponTitle,
    );

    if (!request.locals.coupon) {
      throw new NotFoundException('Such coupon does not exist');
    }

    return true;
  }
}
