import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { UsersService } from './users/users.service';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { doc } from 'prettier';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appService = app.get(AppService);

  const config = new DocumentBuilder()
    .setTitle("Transcendence API")
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes( new ValidationPipe() );
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  app.enableCors({
    origin: [`http://${configService.get<string>('ip')}:${configService.get<string>('frontPort')}`,
      `http://${configService.get<string>('ip')}:${configService.get<string>('backPort')}`, `http://10.13.7.3:4000/auth/logout`],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();