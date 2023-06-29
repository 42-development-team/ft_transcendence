import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { doc } from 'prettier';


// const URL: string = process.env.LOCAL_IP + ":" + process.env.FRONT_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);

  const config = new DocumentBuilder()
    .setTitle("Transcendence API")
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    // origin: "URL",
    // origin: "http://front:3000"
    // credentials: true,
  });
  await app.listen(4000);

}
bootstrap();
