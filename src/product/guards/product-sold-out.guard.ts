import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductFull } from '../../dal/product/entity-types/product-full.type';

@Injectable()
export class ProductSoldOutGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const product: ProductFull = request.locals?.product;

    if (!product || product.isFullyBooked) {
      throw new NotFoundException(
        'Product with such id was fully booked and cannot be used',
      );
    }

    return true;
  }
}
