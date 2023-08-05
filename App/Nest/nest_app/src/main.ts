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
import * as multer from 'multer';
import * as session from 'express-session';
import { randomBytes } from 'crypto';



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug'], 
  });
  const configService = app.get(ConfigService);
  const appService = app.get(AppService);
  const secretKey = randomBytes(32).toString('hex');

  const config = new DocumentBuilder()
    .setTitle("Transcendence API")
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes( new ValidationPipe() );
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());

  // set up multer middleware for file uploads
  // => the ./uploads/ directory is used as a temporary storage location 
  // for the uploaded images before they are sent to Cloudinary
  // => 'file' (to be set in the front) is the field name in the form data for the uploaded file 
  app.use(multer({ dest: './uploads/'}).single('file'));


  app.use(
    session({
      secret: secretKey,
      resave: false,
      saveUninitialized: true,
    }),
  );

  app.enableCors({
    origin: [`http://${configService.get<string>('ip')}:${configService.get<string>('frontPort')}`,
      `http://${configService.get<string>('ip')}:${configService.get<string>('backPort')}`],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();