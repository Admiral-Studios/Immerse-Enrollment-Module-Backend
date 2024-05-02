import { Injectable, Logger } from '@nestjs/common';
import { SiblingCoupon, StudentDetails } from '@prisma/client';
import { EntityManager } from '../dal/entity-manager';
import { SIBLING_COUPON_DETAILS } from '../common/common.constants';
import { generateSiblingCoupon } from './helper/generate-sibling-coupon.helper';

@Injectable()
export class SiblingCouponService {
  private readonly logger = new Logger(SiblingCouponService.name);

  constructor(private readonly em: EntityManager) {}

  public async generateSiblingCoupon(
    studentDetails: StudentDetails,
  ): Promise<SiblingCoupon | null> {
    const retries = 10;
    let attempts = 0;

    const currentDate = new Date();
    const expiryDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + SIBLING_COUPON_DETAILS.monthsUntilExpiration,
      currentDate.getDate(),
    );

    while (attempts < retries) {
      const couponTitle = generateSiblingCoupon(studentDetails, attempts);
      const existingCoupon =
        await this.em.siblingCouponRepository.findSiblingCouponByTitle(
          couponTitle,
        );

      if (!existingCoupon) {
        return await this.em.siblingCouponRepository.createSiblingCoupon({
          expiryDate,
          studentDetails: JSON.stringify(studentDetails),
          title: couponTitle,
          amount: SIBLING_COUPON_DETAILS.amount,
          description: SIBLING_COUPON_DETAILS.description,
          discountType: SIBLING_COUPON_DETAILS.discountType,
        });
      }

      attempts++;
    }
    this.logger.error('Could not generate sibling coupon');
    return null;
  }
}
