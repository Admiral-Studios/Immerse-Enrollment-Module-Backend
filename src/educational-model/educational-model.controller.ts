import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Locals } from '../common/decorators/locals.decorator';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { ProductOrderExistsGuard } from '../product-order/guards/product-order-exists.guard';
import { EducationalModelResponseDto } from './dto/response-dto/educational-model-response.dto';
import { EducationalModelService } from './educational-model.service';

@Controller('educational-model')
@ApiTags('educational-model')
export class EducationalModelController {
  constructor(
    private readonly educationalModelService: EducationalModelService,
  ) {}

  @ApiOperation({ summary: 'Get all educational models by product order' })
  @ApiParam({ name: 'productOrderId', type: String })
  @UseGuards(ProductOrderExistsGuard)
  @Get('by-product-order/:productOrderId')
  getEducationalModelsByProductOrder(
    @Locals('productOrder') productOrder: ProductOrderFull,
  ): Promise<EducationalModelResponseDto[]> {
    return this.educationalModelService.getEducationalModelsByProductOrder(
      productOrder,
    );
  }
}
