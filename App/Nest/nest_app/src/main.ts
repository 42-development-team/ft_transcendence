import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { UsersService } from './users/users.service';

/////////// TEST CORS ///////////////
// var whitelist = ['https://localhost:4000'];
//   app.enableCors({
//     origin: function(origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//           console.log("allowed cors for:", origin)
//           callback(null, true)
//         } else {
//           console.log("blocked cors for:", origin)
//           callback(new Error('Not allowed by CORS'))
//         }
//       },
//     methods: "GET, PUT, POST, DELETE, OPTIONS",
//     credentials : true,
//   });
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
  app.enableCors({
    origin:'http://localhost:4000/users',
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);

}
bootstrap();