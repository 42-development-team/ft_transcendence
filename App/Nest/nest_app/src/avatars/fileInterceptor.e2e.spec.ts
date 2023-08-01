import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';

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

  it('/avatars/upload (POST) - should correctly handle the file upload', async () => {
    // Mock the file object (replace this with a proper mocked file object)
    const file = {
      path: '/path/to/avatar_test.jpg',
    };

    const response = await request(app.getHttpServer())
      .post('/avatars/upload')
      .attach('file', file.path)
      .expect(201);

    // Assertions
    expect(response.body.imageUrl).toBeDefined();
    expect(typeof response.body.imageUrl).toBe('string');
    expect(response.body.imageUrl).toContain('cloudinary.com'); // Check if the URL contains 'cloudinary.com'
  });

  // Add more tests to cover different scenarios and error cases
});
