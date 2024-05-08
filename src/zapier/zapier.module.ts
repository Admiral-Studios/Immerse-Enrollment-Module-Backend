import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { ZapierService } from './zapier.service';

@Module({
  imports: [HttpModule, ProductModule],
  providers: [ZapierService],
  exports: [ZapierService],
})
export class ZapierModule {}
