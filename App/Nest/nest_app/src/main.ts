import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { UsersService } from './users/users.service';
/////////// TEST CORS ///////////////

//////////////////////////////////////

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { doc } from 'prettier';
import { ValidationPipe } from '@nestjs/common';


// const URL: string = process.env.LOCAL_IP + ":" + process.env.FRONT_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });
  const appService = app.get(AppService);

  const config = new DocumentBuilder()
    .setTitle("Transcendence API")
    .setVersion('0.1')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes( new ValidationPipe() );
  var cors = require('cors')

  app.options('/users', cors()) // enable pre-flight request for DELETE request
  app.del('/users', cors(), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })
  SwaggerModule.setup('api', app, document);
  await app.listen(4000, function () {
    console.log('CORS-enabled web server listening on port 4000')
  })
  // await app.listen(4000);

}
bootstrap();