import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getClassicPackageFromPackages } from '../../common/helper/get-package-from-packages.helper';
import { EntityManager } from '../../dal/entity-manager';
import { PackageWithClassification } from '../../dal/product/entity-types/package-with-classification.type';
import { ProductFull } from '../../dal/product/entity-types/product-full.type';
import { ProductPackageWithDiscountResponseDto } from '../dto/response-dto/package-with-discount-response.dto';

@Injectable()
export class GetProductPackagesUseCase {
  constructor(private readonly em: EntityManager) {}

  public async exec(
    product: ProductFull,
  ): Promise<ProductPackageWithDiscountResponseDto[]> {
    const classicPackage = getClassicPackageFromPackages(product.packages);

    const packages = await Promise.all(
      product.packages.map((pack) => this.processPackage(pack, classicPackage)),
    );

    return plainToInstance(ProductPackageWithDiscountResponseDto, packages);
  }

  private async processPackage(
    pack: PackageWithClassification,
    classicPackage: PackageWithClassification,
  ) {
    const priceInfo = {
      price: pack.price,
      discount: 0,
      discountPrice: pack.price,
    };

    const educationalModelTitle = pack.classification.title
      .split('+')[1]
      ?.trim();
    if (!educationalModelTitle) return { ...pack, ...priceInfo };

    const educationalModel =
      await this.em.educationalModelRepository.findEducationalModelByTitle(
        educationalModelTitle,
      );
    if (!educationalModel) return { ...pack, ...priceInfo };

    const foundProduct = await this.em.productRepository.findProduct({
      educationalModelId: educationalModel.id,
    });
    if (!foundProduct) return { ...pack, ...priceInfo };

    const foundProductClassicPackage = getClassicPackageFromPackages(
      foundProduct.packages,
    );
    // TODO: I guess classic package should always be there but this error should be removed probably
    if (!foundProductClassicPackage) return { ...pack, ...priceInfo };

    const diff =
      classicPackage.price + foundProductClassicPackage.price - pack.price;
    priceInfo.price = classicPackage.price + foundProductClassicPackage.price;
    priceInfo.discount = Math.floor((diff * 100) / priceInfo.price);

    return { ...pack, ...priceInfo };
  }
}
