import { Injectable } from '@nestjs/common';
import { EducationalModel, Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  EducationalModelWithAges,
  educationalModelWithAgesInclude,
} from './entity-types/educational-model-with-ages.type';
import { FindAllEducationalModelsOptions } from './interfaces/find-all-educational-models-options.interface';

@Injectable()
export class EducationalModelRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public findAllEducationalModels(
    options: FindAllEducationalModelsOptions,
    tx?: Prisma.TransactionClient,
  ): Promise<EducationalModelWithAges[]> {
    const transactionManager = tx ?? this.prisma;

    const whereConditions: Prisma.EducationalModelWhereInput = {
      taxonomies: {
        some: {
          product: {
            isFullyBooked: false,
            packages: { some: { isAvailable: true, isSoldOut: false } },
            ...(options.excludedProductIds && {
              id: { notIn: options.excludedProductIds },
            }),
          },
          ...(options.locationId && { locationId: options.locationId }),
          ...(options.ageGroupIds && { ageId: { in: options.ageGroupIds } }),
        },
      },
    };

    return transactionManager.educationalModel.findMany({
      where: whereConditions,
      include: educationalModelWithAgesInclude,
    });
  }

  public async findAllWithUnused(
    tx?: Prisma.TransactionClient,
  ): Promise<EducationalModel[]> {
    const transactionManager = tx ?? this.prisma;
    return await transactionManager.educationalModel.findMany({});
  }

  public findEducationalModelById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<EducationalModel> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.educationalModel.findUnique({ where: { id } });
  }

  public findEducationalModelByTitle(
    title: string,
    tx?: Prisma.TransactionClient,
  ): Promise<EducationalModelWithAges> {
    const transactionManager = tx ?? this.prisma;

    return transactionManager.educationalModel.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
      include: educationalModelWithAgesInclude,
    });
  }

  public async createMany(
    data: Prisma.EducationalModelCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ) {
    const transactionManager = tx ?? this.prisma;
    try {
      return await Promise.all(
        data.map((item) =>
          transactionManager.educationalModel.upsert({
            create: item,
            where: {
              wordpressId: item.wordpressId,
            },
            update: {
              title: item.title,
              description: item.description,
            },
          }),
        ),
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async deleteMany(
    educationalModels: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const transactionManager = tx ?? this.prisma;
    // TODO: consider moving order deletion out of this repository
    await transactionManager.order.deleteMany({
      where: {
        productOrders: {
          some: {
            educationalModelId: {
              in: educationalModels,
            },
          },
        },
      },
    });

    return await transactionManager.educationalModel.deleteMany({
      where: {
        id: {
          in: educationalModels,
        },
      },
    });
  }
}
