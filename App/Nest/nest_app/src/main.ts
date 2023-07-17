import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { UsersService } from './users/users.service';
import * as cookieParser from 'cookie-parser';

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { doc } from 'prettier';
import { ValidationPipe } from '@nestjs/common';

const baseFrontUrl: string = `http://${process.env.IP}:${process.env.BACK_FRONT}` as string;
const baseBackUrl: string = `http://${process.env.IP}:${process.env.BACK_BACK}` as string;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    // origin: ["http://localhost:3000", "http://localhost:4000"],
    origin: [baseFrontUrl, baseBackUrl],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();