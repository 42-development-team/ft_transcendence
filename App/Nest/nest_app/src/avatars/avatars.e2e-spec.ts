import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';
import { existsSync, unlinkSync } from 'fs';
import { Public } from '../auth/public.routes'; // Update the import path as per your actual file structure

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

  const performAvatarUpload = async (publicTest: boolean) => {
    const filePath = './test_images/avatar_test.jpg';
    const response = await request(app.getHttpServer())
      .post('/avatars/upload')
      .attach('file', filePath);

    if (publicTest) {
      // Public test case: No JWT authentication expected
      expect(response.status).toBe(201);
    } else {
      // Private test case: JWT authentication expected
      expect(response.status).toBe(201);
    }

    expect(response.body.imageUrl).toBeDefined();
    expect(typeof response.body.imageUrl).toBe('string');

    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  };

  // Public test case: No JWT authentication expected
  @Public()
  it('/avatars/upload (POST) - should upload the avatar and return the avatar URL without JWT authentication', async () => {
    await performAvatarUpload(true);
  });

  // Private test case: JWT authentication expected
  it('/avatars/upload (POST) - should upload the avatar and return the avatar URL with JWT authentication', async () => {
    await performAvatarUpload(false);
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
