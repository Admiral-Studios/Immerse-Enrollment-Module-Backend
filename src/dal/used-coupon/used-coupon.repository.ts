import { Injectable } from '@nestjs/common/decorators';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  UsedCouponFull,
  usedCouponFullInclude,
} from './entity-types/used-coupon-full.type';

@Injectable()
export class UsedCouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  public createUsedCoupon(
    data: Prisma.UsedCouponUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<UsedCouponFull> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.usedCoupon.create({
      data,
      include: usedCouponFullInclude,
    });
  }

  public findAllUsedCoupons(
    where: Prisma.UsedCouponWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<UsedCouponFull[]> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.usedCoupon.findMany({
      where,
      include: usedCouponFullInclude,
    });
  }

  public findUsedCoupon(
    data: Prisma.UsedCouponWhereInput,
    tx?: Prisma.TransactionClient,
  ): Promise<UsedCouponFull> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.usedCoupon.findFirst({
      where: data,
      include: usedCouponFullInclude,
    });
  }

  public incrementUsedCouponTotalUsed(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UsedCouponFull> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.usedCoupon.update({
      where: { id },
      data: { totalUsed: { increment: 1 } },
      include: usedCouponFullInclude,
    });
  }
}
