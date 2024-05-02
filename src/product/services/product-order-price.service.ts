import { Injectable } from '@nestjs/common';
import { Coupon, SiblingCoupon } from '@prisma/client';
import { CouponDiscountTypesEnum } from '../../common/enums/coupon-discount-types.enum';
import { DepositTypesEnum } from '../../common/enums/deposit-types.enum';
import { EntityManager } from '../../dal/entity-manager';
import { ProductOrderFull } from '../../dal/product-order/entity-types/product-order-full.type';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class ProductOrderPriceService {
  constructor(private readonly em: EntityManager) {}

  public countProductOrdersTotalPrice(
    productOrders: ProductOrderFull[],
  ): number {
    const total = productOrders.reduce(
      (total: number, productOrder: ProductOrderFull) => {
        const productOrderPrice = this.getProductOrderPrice(productOrder);
        const couponDiscount = this.getCouponDiscount(productOrder);
        const productOrderDiscount = productOrderPrice * productOrder.discount;
        const transferPrice = this.getTransferPrice(productOrder);

        const productTotal =
          productOrderPrice -
          productOrderDiscount -
          couponDiscount +
          transferPrice;

        return total + productTotal;
      },
      0,
    );

    return Math.round(total * 100) / 100;
  }

  public async countProductOrdersTotalDeposit(
    productOrders: ProductOrderFull[],
  ) {
    if (productOrders.length === 0) return 0;
    const globalDeposit = (await this.em.depositRepository.findAll())[0];
    const hasProductsWithDepositEnabled = productOrders.some(
      (productOrder: ProductOrderFull) =>
        productOrder.package?.isDepositEnabled,
    );
    if (!hasProductsWithDepositEnabled) {
      return null;
    }

    const total = productOrders.reduce(
      (total: number, productOrder: ProductOrderFull) => {
        const productOrderPackage = productOrder.package;

        if (!productOrderPackage) return total;

        if (!productOrderPackage.isDepositEnabled)
          return total + productOrderPackage.price;

        let calculatedDeposit: number;

        switch (productOrderPackage.depositType) {
          case DepositTypesEnum.percentage:
            calculatedDeposit =
              (productOrderPackage.depositAmount / 100) *
              productOrderPackage.price;
            break;
          case DepositTypesEnum.global:
            calculatedDeposit = globalDeposit.defaultDepositAmount;
            break;
          case DepositTypesEnum.fixed:
            calculatedDeposit = productOrderPackage.depositAmount;
            break;
        }
        return total + Math.min(calculatedDeposit, productOrderPackage.price);
      },
      0,
    );

    return Math.round(total * 100) / 100;
  }

  private getCouponDiscount(productOrder: ProductOrderFull): number {
    const productOrderPrice = this.getProductOrderPrice(productOrder);
    const selectedCoupon: Coupon | SiblingCoupon =
      productOrder.coupon || productOrder.siblingCoupon;

    if (!selectedCoupon) return 0;

    const couponAmount = selectedCoupon.amount;

    switch (selectedCoupon.discountType) {
      case CouponDiscountTypesEnum.percentage:
        return (productOrderPrice * couponAmount) / 100;
      case CouponDiscountTypesEnum.fixed:
        return couponAmount;
      default:
        return 0;
    }
  }

  private getProductOrderPrice(productOrder: ProductOrderFull): number {
    return productOrder.package?.price || 0;
  }

  private getTransferPrice(productOrder: ProductOrderFull): number {
    const transferPrice = productOrder.location?.airportTransferPrice || 0;
    if (productOrder.transferFrom && productOrder.transferTo) {
      return transferPrice * 2;
    } else if (productOrder.transferFrom || productOrder.transferTo) {
      return transferPrice;
    }
    return 0;
  }
}
