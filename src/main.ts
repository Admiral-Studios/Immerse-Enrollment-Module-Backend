import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { LoggerService } from './infra/pino/logger';
import { RestLoggingInterceptor } from './infra/pino/rest-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Immerse education backend')
    .setDescription('Backend for Immerse Education')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new RestLoggingInterceptor());

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  await app.listen(configService.get<number>('PORT'));
}

bootstrap();
