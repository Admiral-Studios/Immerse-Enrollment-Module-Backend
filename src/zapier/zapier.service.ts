import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompletedOrder, SiblingCoupon } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { OrderFull } from '../dal/order/entity-types/order-full.type';
import { CompletedOrderResponseDto } from './dto/response-dto/completed-order.dto';
import { SiblingCouponResponseDto } from './dto/response-dto/sibling-coupon.dto';
import { CreateCompleteOrderDto } from '../order/dto/request-dto/create-complete-order.dto';
import { UnfinishedOrderResponseDto } from './dto/response-dto/unfinished-order.dto';
import { ProductOrderPriceService } from '../product/services/product-order-price.service';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';

@Injectable()
export class ZapierService {
  private readonly logger = new Logger(ZapierService.name);
  private readonly completedOrderUrl = this.configService.get<string>(
    'ZAPIER_COMPLETED_ORDER_URL',
  );
  private readonly siblingCouponUrl =
    this.configService.get<string>('ZAPIER_SIBLING_URL');
  private readonly orderUrl =
    this.configService.get<string>('ZAPIER_ORDER_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly productOrderPriceService: ProductOrderPriceService,
  ) {}

  public async splitOrderIntoMultipleOrders(
    completedOrder: CompletedOrder,
  ): Promise<CompletedOrderResponseDto[]> {
    const productOrders = JSON.parse(completedOrder.productOrders as string);
    const studentDetails = JSON.parse(completedOrder.studentDetails as string);
    const coupon = JSON.parse(completedOrder.coupon as string);
    const isDeposit =
      completedOrder.amountPaid === completedOrder.totalDepositAmount;
    const isBundle = productOrders.length > 1;

    const completedOrders = await Promise.all(
      productOrders.map(async (productOrder: ProductOrderFull) => {
        const totalDepositAmount = isDeposit
          ? await this.productOrderPriceService.countProductOrdersTotalDeposit([
              productOrder,
            ])
          : null;
        const totalOrderAmount =
          this.productOrderPriceService.countProductOrdersTotalPrice([
            productOrder,
          ]);

        return plainToInstance(CompletedOrderResponseDto, {
          ...completedOrder,
          productOrder,
          isDeposit,
          isBundle,
          totalOrderAmount,
          totalDepositAmount,
          amountPaid: isDeposit ? totalDepositAmount : totalOrderAmount,
          studentDetails,
          coupon,
        });
      }),
    );

    return completedOrders;
  }

  public async sendCompletedOrderWebhook(completedOrder: CompletedOrder) {
    try {
      const completedOrders = await this.splitOrderIntoMultipleOrders(
        completedOrder,
      );

      await this.httpService.axiosRef.post(
        this.completedOrderUrl,
        completedOrders,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  public async sendSiblingCouponWebhook(siblingCoupon: SiblingCoupon) {
    try {
      const siblingCouponFormatted = plainToInstance(
        SiblingCouponResponseDto,
        siblingCoupon,
      );
      await this.httpService.axiosRef.post(
        this.siblingCouponUrl,
        siblingCouponFormatted,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  public async sendOrderWebhook(order: OrderFull) {
    try {
      const unfinishedOrders = order.productOrders.map((productOrder) =>
        plainToInstance(UnfinishedOrderResponseDto, {
          ...order,
          productOrder,
        }),
      );

      await this.httpService.axiosRef.post(this.orderUrl, unfinishedOrders, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }
}
