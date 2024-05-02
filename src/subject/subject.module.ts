import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [PrismaModule, ProductModule, OrderModule, DalModule],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
