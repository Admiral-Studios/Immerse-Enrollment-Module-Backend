import { Injectable } from '@nestjs/common';
import { EntityManager } from '../dal/entity-manager';
import { StripeEvent } from '@prisma/client';

@Injectable()
export class StripeEventService {
  constructor(private readonly entityManager: EntityManager) {}

  public async createStripeEvent(stripeEventId: string): Promise<StripeEvent> {
    return await this.entityManager.stripeEventRepository.createStripeEvent(
      stripeEventId,
    );
  }

  public async stripeEventExists(stripeEventId: string): Promise<boolean> {
    const stripeEvent =
      await this.entityManager.stripeEventRepository.getStripeEventByEventId(
        stripeEventId,
      );
    return !!stripeEvent;
  }
}
