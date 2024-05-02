import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from '../dal/entity-manager';
import { ProductFull } from '../dal/product/entity-types/product-full.type';
import { ProductPackageWithDiscountResponseDto } from './dto/response-dto/package-with-discount-response.dto';
import { ProductResponseDto } from './dto/response-dto/product-response.dto';
import { UploadProductsDto } from './dto/request-dto/upload-products.dto';
import { GetProductPackagesUseCase } from './use-cases/get-product-packages.use-case';
import { DeleteTaxonomiesDto } from '../taxonomy/dto/request-dto/delete-taxonomies.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly getProductPackagesUseCase: GetProductPackagesUseCase,
  ) {}

  public async createProducts(productsDto: UploadProductsDto[]): Promise<void> {
    for (const dto of productsDto) {
      await this.em
        .transaction(async (tx: Prisma.TransactionClient) => {
          return await this.em.productRepository.createOrUpdateProductWithTaxonomies(
            dto,
            tx,
          );
        })
        .catch((err: Error) => this.logger.error(err.message, err.stack));
    }
  }

  public async getAllProducts() {
    const products = await this.em.productRepository.findAllProducts();
    return plainToInstance(ProductResponseDto, products);
  }

  public async getProductPackages(
    product: ProductFull,
  ): Promise<ProductPackageWithDiscountResponseDto[]> {
    try {
      return await this.getProductPackagesUseCase.exec(product);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        this.logger.error(error.message, error.stack);
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  public async deleteNotExistingProducts(existingProducts: string[]) {
    const products = await this.em.productRepository.findAllProducts();
    const productsForDeletion = products.filter(
      (product) => !existingProducts.some((p) => p === product.productId),
    );
    return await this.em.transaction(async (tx) => {
      return await this.em.productRepository.delete(
        productsForDeletion.map((p) => p.id),
        tx,
      );
    });
  }

  // TODO: implement this method
  public async deleteProductsWithTaxonomies(
    taxonomiesForDeletionIds: DeleteTaxonomiesDto,
    tx?: Prisma.TransactionClient,
  ) {
    const products = await this.em.productRepository.findAllProducts(tx);
    const filteredProductsIds = await products
      .filter((product) =>
        this.productHasTaxonomies(product, taxonomiesForDeletionIds),
      )
      .map((product) => product.id);
    return await this.em.productRepository.delete(filteredProductsIds);
  }

  productHasTaxonomies(
    product: ProductFull,
    taxonomiesForDeletionIds: DeleteTaxonomiesDto,
  ) {
    const taxonomy = product.taxonomy;
    return (
      taxonomiesForDeletionIds.tags.some((taxonomyForDeletionId) =>
        taxonomy.tags.find((tax) => tax.id === taxonomyForDeletionId),
      ) ||
      taxonomiesForDeletionIds.programDates.some((taxonomyForDeletionId) =>
        taxonomy.programDates.find((tax) => tax.id === taxonomyForDeletionId),
      ) ||
      taxonomiesForDeletionIds.ages.some(
        (taxonomyForDeletionId) => taxonomy.age.id === taxonomyForDeletionId,
      ) ||
      taxonomiesForDeletionIds.teachingFormats.some(
        (taxonomyForDeletionId) =>
          taxonomy.teachingFormat.id === taxonomyForDeletionId,
      ) ||
      taxonomiesForDeletionIds.classifications.some((taxonomyForDeletionId) =>
        taxonomy.classifications.find(
          (tax) => tax.id === taxonomyForDeletionId,
        ),
      ) ||
      taxonomiesForDeletionIds.pathways.some(
        (taxonomyForDeletionId) =>
          taxonomy.pathway.id === taxonomyForDeletionId,
      ) ||
      taxonomiesForDeletionIds.educationalModels.some(
        (taxonomyForDeletionId) =>
          taxonomy.educationalModel.id === taxonomyForDeletionId,
      ) ||
      taxonomiesForDeletionIds.subjects.some(
        (taxonomyForDeletionId) =>
          taxonomy.subject.id === taxonomyForDeletionId,
      ) ||
      taxonomiesForDeletionIds.locations.some(
        (taxonomyForDeletionId) =>
          taxonomy.location.id === taxonomyForDeletionId,
      )
    );
  }
}
