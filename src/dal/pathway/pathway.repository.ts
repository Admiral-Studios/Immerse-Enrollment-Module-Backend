import { Injectable } from '@nestjs/common';
import { Pathway, Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class PathwayRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async createMany(
    data: Prisma.PathwayCreateManyInput[],
    tx?: Prisma.TransactionClient,
  ) {
    const transactionManager = tx ?? this.prisma;
    try {
      return await Promise.all(
        data.map((item) =>
          transactionManager.pathway.upsert({
            create: item,
            where: {
              wordpressId: item.wordpressId,
            },
            update: {
              title: item.title,
            },
          }),
        ),
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async findAllWithUnused(
    tx?: Prisma.TransactionClient,
  ): Promise<Pathway[]> {
    const transactionManager = tx ?? this.prisma;
    return await transactionManager.pathway.findMany({});
  }

  public async deleteMany(
    pathways: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    const transactionManager = tx ?? this.prisma;

    return await transactionManager.pathway.deleteMany({
      where: {
        id: {
          in: pathways,
        },
      },
    });
  }
}
