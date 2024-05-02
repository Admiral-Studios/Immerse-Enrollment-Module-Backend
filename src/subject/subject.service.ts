import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getProductIdsFromOrderExcluding } from '../common/helper/get-product-ids-from-order.helper';
import { EntityManager } from '../dal/entity-manager';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { getProgramDatesFromProductOrders } from '../program-date/helper/get-program-dates-from-order.helper';
import { SubjectResponseDto } from './dto/subject-response.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly entityManager: EntityManager) {}

  public async getSubjectsByProductOrder(
    productOrder: ProductOrderFull,
  ): Promise<SubjectResponseDto[]> {
    const ageGroups = await this.entityManager.ageRepository.findAllAgeGroups({
      locationId: productOrder.locationId,
      maxAge: productOrder.age?.maxAge,
      minAge: productOrder.age?.minAge,
    });

    const order = await this.entityManager.orderRepository.findFullOrderById(
      productOrder.orderId,
    );

    const productIds = getProductIdsFromOrderExcluding(order, productOrder.id);
    // TODO: hardcode again, have no idea how to handle the products
    //       that are online and are not supposed to have dates
    const programDates =
      productOrder.location.title === 'Online'
        ? null
        : getProgramDatesFromProductOrders(
            order.productOrders,
            productOrder.id,
          );

    const subjects = await this.entityManager.subjectRepository.findAllSubjects(
      {
        locationId: productOrder.locationId,
        educationalModelId: productOrder.educationalModelId,
        ageGroupIds: ageGroups.map((ageGroup) => ageGroup.id),
        excludedProductIds: productIds,
        excludedProgramDates: programDates,
      },
    );

    return plainToInstance(SubjectResponseDto, subjects);
  }
}
