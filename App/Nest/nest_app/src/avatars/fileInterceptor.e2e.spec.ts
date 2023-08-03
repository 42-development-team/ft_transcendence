import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';
import * as path from 'path';
import { AvatarsController } from '../avatars/avatars.controller';
import { CloudinaryService } from '../avatars/cloudinary.service';
import { UsersService } from '../users/users.service';
import { MulterModule } from '@nestjs/platform-express';
import { Public } from '../auth/public.routes';

describe('Avatars (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // Import the MulterModule to support file uploads
        MulterModule.register({
          dest: './test_images',
        }),
      ],
      controllers: [AvatarsController],
      providers: [CloudinaryService, UsersService],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/avatars/upload (POST) - should correctly handle the file upload', async () => {
    jest.setTimeout(15000);
    const file = {
      fieldname: 'file',
      originalname: 'avatar_test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './test_images',
      filename: 'avatar_test.jpg',
      path: path.join(__dirname, 'test_images', 'avatar_test.jpg'),
      size: 12345, // Add the appropriate file size
    };

    try {
      console.log('Uploading avatar...');

      const response = await request(app.getHttpServer())
        .post('/avatars/upload')
        .attach('file', file.path) // Attach the file to the request
        .expect(201);

      console.log('Avatar uploaded successfully.');

      // Assertions
      expect(response.body.imageUrl).toBeDefined();
      expect(typeof response.body.imageUrl).toBe('string');
      expect(response.body.imageUrl).toContain('cloudinary.com');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });

  it('/avatars/upload (POST) - should handle file upload without JWT authentication', async () => {
    jest.setTimeout(15000);
    const file = {
      // Similar to the previous test
      fieldname: 'file',
      originalname: 'avatar_test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './test_images',
      filename: 'avatar_test.jpg',
      path: path.join(__dirname, 'test_images', 'avatar_test.jpg'),
      size: 12345, // Add the appropriate file size
    };

    try {
      console.log('Uploading avatar without JWT authentication...');

      const response = await request(app.getHttpServer())
        .post('/avatars/upload')
        .attach('file', file.path)
        .expect(201);

      console.log('Avatar uploaded successfully without JWT authentication.');

      // Assertions
      expect(response.body.imageUrl).toBeDefined();
      expect(typeof response.body.imageUrl).toBe('string');
      expect(response.body.imageUrl).toContain('cloudinary.com');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });
});
