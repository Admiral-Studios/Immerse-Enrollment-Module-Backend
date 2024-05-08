import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [PrismaModule, ProductModule, OrderModule, DalModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
