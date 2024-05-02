import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Coupon, Prisma, StudentDetails } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from '../dal/entity-manager';
import { CreateUsedCouponDto } from './dto/request-dto/create-used-coupon.dto';
import { UploadCouponsDto } from './dto/request-dto/upload-coupons.dto';
import { CouponResponseDto } from './dto/response-dto/coupon-response.dto';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);
  constructor(
    private readonly em: EntityManager,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async uploadCoupons(createCouponsDto: UploadCouponsDto[]) {
    const coupons = await Promise.all(
      createCouponsDto.map((createCouponDto) =>
        this.em.couponRepository.uploadCoupon(createCouponDto),
      ),
    );

    return plainToInstance(CouponResponseDto, coupons);
  }

  public async getAllCoupons() {
    const coupons = await this.em.couponRepository.findAllCoupons();
    return plainToInstance(CouponResponseDto, coupons);
  }

  public async incrementCouponTotalUsed(
    couponId: string,
    studentDetails: StudentDetails,
  ): Promise<void> {
    const coupon = await this.em.transaction(
      async (tx: Prisma.TransactionClient) => {
        const coupon = await this.em.couponRepository.incrementCouponTotalUsed(
          couponId,
          tx,
        );

        // Creating used coupon or incrementing total used of existing one
        const usedCouponData = plainToInstance(CreateUsedCouponDto, {
          couponId,
          ...studentDetails,
        });

        const usedCoupon = await this.em.usedCouponRepository.findUsedCoupon(
          usedCouponData,
          tx,
        );

        if (usedCoupon) {
          await this.em.usedCouponRepository.incrementUsedCouponTotalUsed(
            usedCoupon.id,
            tx,
          );
        } else {
          await this.em.usedCouponRepository.createUsedCoupon(
            { ...usedCouponData, totalUsed: 1 },
            tx,
          );
        }

        return coupon;
      },
    );

    await this.syncCouponWithWordpress(coupon);
  }

  public async syncCouponWithWordpress(coupon: Coupon): Promise<void> {
    try {
      const wordPressUrl = this.configService.get<string>(
        'WORDPRESS_SYNC_COUPON_URL',
      );
      const wordPressApiKey =
        this.configService.get<string>('WORDPRESS_API_KEY');

      await this.httpService.axiosRef.post(
        wordPressUrl,
        {
          post_id: coupon.wordpressId,
          coupon_total_used: coupon.totalUsed,
        },
        {
          headers: {
            'X-API-Key': wordPressApiKey,
          },
        },
      );
    } catch (error) {
      this.logger.error('Could not sync coupon with wordpress', error.stack);
    }
  }

  public async deleteNotExistingCoupons(existingCoupons: string[]) {
    const coupons = await this.em.couponRepository.findAllCoupons();
    const couponsForDeletion = coupons.filter(
      (coupon) => !existingCoupons.some((c) => c === coupon.wordpressId),
    );
    return await this.em.transaction(async (tx) => {
      return await this.em.couponRepository.delete(
        couponsForDeletion.map((p) => p.id),
        tx,
      );
    });
  }
}
