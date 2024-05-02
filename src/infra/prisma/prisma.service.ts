import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { queryLogger } from '../pino/logger';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
    this.$on('error', ({ message }) => {
      queryLogger.logQueryError({ message });
    });
    this.$on('warn', ({ message }) => {
      queryLogger.logQueryWarning({ message });
    });
    this.$on('info', ({ message }) => {
      queryLogger.logQueryInfo({ message });
    });
    this.$on('query', ({ query, params }) => {
      queryLogger.logQuery({ query, params });
    });
  }
}
