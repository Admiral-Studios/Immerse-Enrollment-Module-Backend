import { Injectable } from '@nestjs/common';
import { StripeEvent } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class StripeEventRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async createStripeEvent(stripeEventId: string): Promise<StripeEvent> {
    return await this.prisma.stripeEvent.create({
      data: {
        stripeEventId,
      },
    });
  }

  public async getStripeEventByEventId(
    stripeEventId: string,
  ): Promise<StripeEvent> {
    return await this.prisma.stripeEvent.findUnique({
      where: {
        stripeEventId,
      },
    });
  }
}
