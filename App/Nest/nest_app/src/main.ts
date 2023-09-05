import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'],
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.enableCors({
    origin: [
      `http://${configService.get<string>('ip')}:${configService.get<string>('frontPort')}`,
      `http://${configService.get<string>('ip')}:${configService.get<string>('backPort')}`,
    ],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
