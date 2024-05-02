import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Locals } from '../common/decorators/locals.decorator';
import { ProductOrderFull } from '../dal/product-order/entity-types/product-order-full.type';
import { ProductOrderExistsGuard } from '../product-order/guards/product-order-exists.guard';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ summary: 'Get all subjects by product order' })
  @ApiParam({ name: 'productOrderId', type: String })
  @UseGuards(ProductOrderExistsGuard)
  @Get('by-product-order/:productOrderId')
  public getSubjectsByProductOrder(
    @Locals('productOrder') productOrder: ProductOrderFull,
  ): Promise<SubjectResponseDto[]> {
    return this.subjectService.getSubjectsByProductOrder(productOrder);
  }
}
