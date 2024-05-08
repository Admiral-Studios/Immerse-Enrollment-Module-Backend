import { SetMetadata } from '@nestjs/common';

export const WebhookEvent = (eventName: string) =>
  SetMetadata('event', eventName);
