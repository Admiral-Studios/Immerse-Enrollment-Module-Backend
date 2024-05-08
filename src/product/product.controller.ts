import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Locals } from '../common/decorators/locals.decorator';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ProductFull } from '../dal/product/entity-types/product-full.type';
import { ProductPackageWithDiscountResponseDto } from './dto/response-dto/package-with-discount-response.dto';
import { ProductResponseDto } from './dto/response-dto/product-response.dto';
import { UploadProductsDto } from './dto/request-dto/upload-products.dto';
import { ProductExistsGuard } from './guards/product-exists.guard';
import { ProductService } from './product.service';
import { DeleteProductsDto } from './dto/request-dto/delete-products.dto';
import { ProductSoldOutGuard } from './guards/product-sold-out.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBody({ type: [UploadProductsDto] })
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  createProducts(
    @Body(
      new ParseArrayPipe({
        items: UploadProductsDto,
        whitelist: true,
      }),
    )
    uploadProductsDto: UploadProductsDto[],
  ) {
    return this.productService.createProducts(uploadProductsDto);
  }

  @Get()
  getAllProducts(): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts();
  }

  @Get(':productId/packages')
  @UseGuards(ProductExistsGuard, ProductSoldOutGuard)
  @ApiParam({ name: 'productId', type: String })
  getProductPackagesByProductId(
    @Locals('product') product: ProductFull,
  ): Promise<ProductPackageWithDiscountResponseDto[]> {
    return this.productService.getProductPackages(product);
  }

  @Post('delete')
  @ApiSecurity('x-api-key')
  @UseGuards(ApiKeyGuard)
  deleteNotExistingProducts(@Body() deleteProductsDto: DeleteProductsDto) {
    return this.productService.deleteNotExistingProducts(
      deleteProductsDto.existingProductIds,
    );
  }
}
