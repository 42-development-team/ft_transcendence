import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary'; 


jest.mock('cloudinary'); // Mock the cloudinary module

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService, ConfigService, PrismaService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should upload an avatar image to Cloudinary and return the image URL', async () => {
    // Mock the file object (replace this with a proper mocked file object)
    const file = {
      path: path.resolve(__dirname, 'test_images/avatar_test.jpg'), // Use path.resolve to get the absolute path
    };

    // Mock the Cloudinary uploader
    const mockUploader = jest.fn().mockResolvedValue({
      secure_url: 'https://cloudinary.com/image_url.jpg',
    });
    (cloudinary.uploader.upload as jest.Mock) = mockUploader;

    // Perform the avatar image upload
    const imageUrl = await service.uploadAvatar(file);

    // Assertions
    expect(typeof imageUrl).toBe('string');
    expect(imageUrl).toContain('cloudinary.com'); // Check if the URL contains 'cloudinary.com'
  });

  // Add more tests to cover different scenarios and error cases
});
