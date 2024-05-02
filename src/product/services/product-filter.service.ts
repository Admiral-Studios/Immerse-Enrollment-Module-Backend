import { Injectable } from '@nestjs/common';
import { ProductOrderFull } from '../../dal/product-order/entity-types/product-order-full.type';
import { ProductOrderPriceService } from './product-order-price.service';

@Injectable()
export class ProductFilterService {
  constructor(
    private readonly productOrderPriceService: ProductOrderPriceService,
  ) {}
  private isProductOnline(productOrder: ProductOrderFull) {
    return productOrder.product.taxonomy.teachingFormat.title === 'Online';
  }

  private isProductInPerson(productOrder: ProductOrderFull) {
    return productOrder.product.taxonomy.teachingFormat.title === 'In-Person';
  }

  public async countProductOrdersOnlineAndInPersonPrices(
    productOrders: ProductOrderFull[],
    isDeposit,
  ): Promise<{ onlinePrice: number; inPersonPrice: number }> {
    const online = productOrders.filter((productOrder) =>
      this.isProductOnline(productOrder),
    );
    const inPerson = productOrders.filter((productOrder) =>
      this.isProductInPerson(productOrder),
    );

    const onlinePrice = isDeposit
      ? await this.productOrderPriceService.countProductOrdersTotalDeposit(
          online,
        )
      : this.productOrderPriceService.countProductOrdersTotalPrice(online);

    const inPersonPrice = isDeposit
      ? await this.productOrderPriceService.countProductOrdersTotalDeposit(
          inPerson,
        )
      : this.productOrderPriceService.countProductOrdersTotalPrice(inPerson);

    console.log(onlinePrice);
    console.log(inPersonPrice);

    return {
      onlinePrice,
      inPersonPrice,
    };
  }

  public hasOnlineAndInPerson(productOrders: ProductOrderFull[]): {
    hasOnline: boolean;
    hasInPerson: boolean;
  } {
    const hasOnline = !!productOrders.find((productOrder) =>
      this.isProductOnline(productOrder),
    );
    const hasInPerson = !!productOrders.find((productOrder) =>
      this.isProductInPerson(productOrder),
    );
    return {
      hasOnline,
      hasInPerson,
    };
  }
}
