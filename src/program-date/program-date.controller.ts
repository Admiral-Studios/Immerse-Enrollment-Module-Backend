import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Locals } from '../common/decorators/locals.decorator';
import { ProductOrderExistsGuard } from '../product-order/guards/product-order-exists.guard';
import { ProgramDateService } from './program-date.service';
import { ProgramDate } from '@prisma/client';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
@Controller('program-date')
@ApiTags('program-date')
export class ProgramDateController {
  constructor(private readonly programDateService: ProgramDateService) {}

  @ApiOperation({ summary: 'Get all program dates by product order' })
  @ApiParam({ name: 'productOrderId', type: String })
  @UseGuards(ProductOrderExistsGuard)
  @Get('by-product-order/:productOrderId')
  public getProgramDatesByProductOrder(
    @Locals('productOrder') productOrder: ProductOrderFull,
  ): Promise<ProgramDate[]> {
    return this.programDateService.getProgramDateByProductOrder(productOrder);
  }
}
