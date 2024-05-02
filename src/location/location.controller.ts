import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Locals } from '../common/decorators/locals.decorator';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { ProductOrderExistsGuard } from '../product-order/guards/product-order-exists.guard';
import { AddAirportTransferDto } from './dto/add-airport-transfer.dto';
import { LocationResponseDto } from './dto/response-dto/location-response.dto';
import { LocationService } from './location.service';

@Controller('location')
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Get available locations by product order' })
  @ApiParam({ name: 'productOrderId', type: String })
  @UseGuards(ProductOrderExistsGuard)
  @Get('by-product-order/:productOrderId')
  public getAvailableLocationsByProductOrder(
    @Locals('productOrder') productOrder: ProductOrderFull,
  ): Promise<LocationResponseDto[]> {
    return this.locationService.getLocationsByProductOrder(productOrder);
  }

  @Post('airport-transfer')
  @ApiSecurity('x-api-key')
  @ApiBody({ type: [AddAirportTransferDto] })
  @UseGuards(ApiKeyGuard)
  public addAirportTransfers(
    @Body(
      new ParseArrayPipe({
        items: AddAirportTransferDto,
      }),
    )
    addAirportTransferDto: AddAirportTransferDto[],
  ): Promise<LocationResponseDto[]> {
    console.log('ADD AIRPORT TRANSFERS!');
    return this.locationService.addAirportTransfer(addAirportTransferDto);
  }
}
