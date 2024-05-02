import { Module } from '@nestjs/common';
import { EducationalModelService } from './educational-model.service';
import { EducationalModelController } from './educational-model.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { AgeModule } from '../age/age.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [PrismaModule, AgeModule, OrderModule, ProductModule, DalModule],
  controllers: [EducationalModelController],
  providers: [EducationalModelService],
})
export class EducationalModelModule {}
