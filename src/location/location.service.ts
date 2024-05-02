import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getProductIdsFromOrderExcluding } from '../common/helper/get-product-ids-from-order.helper';
import { EntityManager } from '../dal/entity-manager';
import { AddAirportTransferDto } from './dto/add-airport-transfer.dto';
import { LocationResponseDto } from './dto/response-dto/location-response.dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { getMaxAndMinAgeFromProductOrders } from '../common/helper/get-age-group-from-product-orders.helper';
import { getProgramDatesFromProductOrders } from '../program-date/helper/get-program-dates-from-order.helper';

@Injectable()
export class LocationService {
  constructor(private readonly entityManager: EntityManager) {}

  public async getLocations(): Promise<LocationResponseDto[]> {
    const locations =
      await this.entityManager.locationRepository.findAllLocations({});

    return plainToInstance(LocationResponseDto, locations);
  }

  public async getLocationsByProductOrder(
    productOrder: ProductOrderFull,
  ): Promise<LocationResponseDto[]> {
    const order = await this.entityManager.orderRepository.findFullOrderById(
      productOrder.orderId,
    );

    const productIds = getProductIdsFromOrderExcluding(order, productOrder.id);
    const ageGroup = getMaxAndMinAgeFromProductOrders(
      order.productOrders,
      productOrder.id,
    );

    const programDates = getProgramDatesFromProductOrders(
      order.productOrders,
      productOrder.id,
    );

    const locations =
      await this.entityManager.locationRepository.findAllLocations({
        excludedProductIds: productIds,
        excludedProgramDates: programDates,
        maxAge: ageGroup?.maxAge,
        minAge: ageGroup?.minAge,
      });

    return plainToInstance(LocationResponseDto, locations);
  }

  public async addAirportTransfer(
    addAirportTransferDto: AddAirportTransferDto[],
  ): Promise<LocationResponseDto[]> {
    try {
      const locations = await Promise.all(
        addAirportTransferDto.map(async (dto) => {
          return this.entityManager.locationRepository.updateLocation(
            {
              wordpressId: dto.location,
            },
            {
              airportTransferPrice: dto.price,
            },
          );
        }),
      );

      return plainToInstance(LocationResponseDto, locations);
    } catch (e) {
      throw new BadRequestException(
        "Couldn't update locations with appropriate airport transfer prices",
      );
    }
  }
}
