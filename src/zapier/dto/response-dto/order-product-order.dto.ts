import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import {
  PreferredMonthsResponseDto,
  ProductOrderCouponResponseDto,
} from '../../../product-order/dto/response-dto/product-order-response.dto';
import { createProductOrderSummaryString } from '../../helper/create-product-order-summary-string.helper';
import { OrderCoupon } from './order-coupon.dto';
import { ProductOrderPriceResponseDto } from '../../../product-order/dto/response-dto/product-order-response.dto';
import { countProductOrderPrice } from '../../../common/helper/count-product-order-price.helper';

@Exclude()
class OrderProduct {
  @Expose()
  title: string;

  @Expose()
  dateDuration: string;

  @Expose()
  priceStartsAt: number;

  @Expose()
  packageSummary: string[];

  @Expose()
  productId: string;

  @Expose()
  preTitle: string;
}

@Exclude()
class OrderProductOrderOption {
  @Expose()
  title: string;

  @Expose()
  wordpressId: string;
}

@Exclude()
class CompletedOrderPackage {
  @Expose()
  packageTitle: string;

  @Expose()
  isAvailableForBundle: boolean;

  @Expose()
  @Type(() => OrderProductOrderOption)
  classification: OrderProductOrderOption;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  discountPrice: number;
}

@Exclude()
export class OrderProductOrder {
  @Expose()
  @Transform(({ obj }) => createProductOrderSummaryString(obj))
  summary: string;

  @Expose()
  @Transform(({ obj }) => countProductOrderPrice(obj))
  @Type(() => ProductOrderPriceResponseDto)
  price: ProductOrderPriceResponseDto;

  @Expose()
  @Type(() => OrderProduct)
  product: OrderProduct;

  @Expose()
  @Type(() => OrderProductOrderOption)
  location: OrderProductOrderOption;

  @Expose()
  @Type(() => OrderProductOrderOption)
  age: OrderProductOrderOption;

  @Expose()
  @Type(() => OrderProductOrderOption)
  educationalModel: OrderProductOrderOption;

  @Expose()
  @Type(() => OrderProductOrderOption)
  subject: OrderProductOrderOption;

  @Expose()
  @Type(() => OrderProductOrderOption)
  programDate: OrderProductOrderOption;

  @Expose()
  @Type(() => PreferredMonthsResponseDto)
  @Transform(({ value }) => JSON.parse(value))
  preferredMonths: PreferredMonthsResponseDto[];

  @Expose()
  @Type(() => CompletedOrderPackage)
  package: CompletedOrderPackage;

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(OrderCoupon, obj.coupon || obj.siblingCoupon),
  )
  @Type(() => ProductOrderCouponResponseDto)
  coupon: ProductOrderCouponResponseDto;

  @Expose()
  transferFrom: boolean;

  @Expose()
  transferTo: boolean;

  @Expose()
  discount: number;

  @Expose()
  createdAt: Date;
}
