import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { AgeModule } from '../age/age.module';
import { DalModule } from '../dal/dal.module';
import { GetProductPackagesUseCase } from './use-cases/get-product-packages.use-case';
import { ProductFilterService } from './services/product-filter.service';
import { ProductOrderPriceService } from './services/product-order-price.service';

@Module({
  imports: [PrismaModule, AgeModule, DalModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    GetProductPackagesUseCase,
    ProductFilterService,
    ProductOrderPriceService,
  ],
  exports: [
    ProductService,
    GetProductPackagesUseCase,
    ProductFilterService,
    ProductOrderPriceService,
  ],
})
export class ProductModule {}
