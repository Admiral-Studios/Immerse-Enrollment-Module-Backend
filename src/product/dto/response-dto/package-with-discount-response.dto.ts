import { Exclude, Expose } from 'class-transformer';
import { ProductPackageResponseDto } from './product-response.dto';

@Exclude()
export class ProductPackageWithDiscountResponseDto extends ProductPackageResponseDto {
  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  discountPrice: number;
}
