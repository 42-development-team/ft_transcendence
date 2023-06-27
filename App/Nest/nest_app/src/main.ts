import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { doc } from 'prettier';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);

  const config = new DocumentBuilder()
    .setTitle("Transcendence API")
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
    })
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);

}
bootstrap();