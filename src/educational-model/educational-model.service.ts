import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getMaxAndMinAgeFromProductOrders } from '../common/helper/get-age-group-from-product-orders.helper';
import { getProductIdsFromOrderExcluding } from '../common/helper/get-product-ids-from-order.helper';
import { EntityManager } from '../dal/entity-manager';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { EducationalModelResponseDto } from './dto/response-dto/educational-model-response.dto';

@Injectable()
export class EducationalModelService {
  constructor(private readonly entityManager: EntityManager) {}

  public async getEducationalModelsByProductOrder(
    productOrder: ProductOrderFull,
  ): Promise<EducationalModelResponseDto[]> {
    const order = await this.entityManager.orderRepository.findFullOrderById(
      productOrder.orderId,
    );

    const productIds = getProductIdsFromOrderExcluding(order, productOrder.id);

    const ageGroup = getMaxAndMinAgeFromProductOrders(
      order.productOrders,
      productOrder.id,
    );

    const ageGroups = await this.entityManager.ageRepository.findAllAgeGroups({
      maxAge: ageGroup?.maxAge,
      minAge: ageGroup?.minAge,
    });

    const educationalModels =
      await this.entityManager.educationalModelRepository.findAllEducationalModels(
        {
          locationId: productOrder.locationId,
          excludedProductIds: productIds,
          ageGroupIds: ageGroups.map((ageGroup) => ageGroup.id),
        },
      );

    const educationalModelsWithAge = educationalModels.map((model) => {
      const minAge = Math.min(
        ...model.taxonomies.map((taxonomy) => taxonomy.age.minAge),
      );
      const maxAge = Math.max(
        ...model.taxonomies.map((taxonomy) => taxonomy.age.maxAge),
      );
      return { ...model, minAge, maxAge };
    });

    return plainToInstance(
      EducationalModelResponseDto,
      educationalModelsWithAge,
    );
  }
}
