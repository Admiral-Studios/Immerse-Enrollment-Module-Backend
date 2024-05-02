import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../../dal/product/product.repository';

@Injectable()
export class ProductExistsGuard implements CanActivate {
  constructor(private readonly productRepository: ProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const productId = request.params?.productId;

    if (!request.locals) {
      request.locals = {};
    }

    request.locals.product =
      await this.productRepository.findProductByProductId(productId);

    if (
      !request.locals.product ||
      request.locals.product.productId !== productId
    ) {
      throw new NotFoundException('Product with such id does not exist');
    }

    return true;
  }
}
