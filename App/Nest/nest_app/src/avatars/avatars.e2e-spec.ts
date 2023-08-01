import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';
import { existsSync, unlinkSync } from 'fs';

describe('Avatars (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/avatars/upload (POST) - should upload the avatar and return the avatar URL', async () => {
    const filePath = './test_images/avatar_test.jpg'; 
    const response = await request(app.getHttpServer())
      .post('/avatars/upload')
      .attach('file', filePath)
      .expect(201);

    expect(response.body.imageUrl).toBeDefined();
    expect(typeof response.body.imageUrl).toBe('string');

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  });

  it('/avatars/upload (POST) - should return 400 when no file is attached', async () => {
    await request(app.getHttpServer())
      .post('/avatars/upload')
      .expect(400, {
        statusCode: 400,
        message: 'Bad Request',
        error: 'Bad Request',
      });
  });

  it('/avatars/upload (POST) - should return 500 when an error occurs during upload', async () => {
    const filePath = './test_images/inexistent_avatar_test.jpg';
    await request(app.getHttpServer())
      .post('/avatars/upload')
      .attach('file', filePath)
      .expect(500, {
        statusCode: 500,
        message: 'Internal server error',
      });
  });
});
