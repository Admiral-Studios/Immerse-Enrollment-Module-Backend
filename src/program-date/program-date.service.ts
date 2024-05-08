import { Injectable } from '@nestjs/common';
import { ProgramDate } from '@prisma/client';
import { EntityManager } from '../dal/entity-manager';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { getProgramDatesFromProductOrders } from './helper/get-program-dates-from-order.helper';
@Injectable()
export class ProgramDateService {
  constructor(private readonly em: EntityManager) {}

  public async getProgramDateByProductOrder(
    productOrder: ProductOrderFull,
  ): Promise<ProgramDate[]> {
    if (!productOrder.packageId) {
      throw new BadRequestException('You have to select a package first');
    }
    const order = await this.em.orderRepository.findFullOrderById(
      productOrder.orderId,
    );

    const selectedProgramDates = getProgramDatesFromProductOrders(
      order.productOrders,
      productOrder.id,
    );

    const foundDates =
      await this.em.programDateRepository.findProgramDatesByPackageId(
        productOrder.packageId,
        { excludeProgramDates: selectedProgramDates },
      );

    return foundDates;
  }
}
