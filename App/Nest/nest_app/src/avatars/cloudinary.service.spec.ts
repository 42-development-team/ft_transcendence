import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should upload an avatar image to Cloudinary and return the image URL', async () => {
    // Mock the file object (replace this with a proper mocked file object)
    const file = {
      path: '/path/to/avatar_test.jpg',
    };

    // Perform the avatar image upload
    const imageUrl = await service.uploadAvatar(file);

    // Assertions
    expect(typeof imageUrl).toBe('string');
    expect(imageUrl).toContain('cloudinary.com'); // Check if the URL contains 'cloudinary.com'
  });

  // Add more tests to cover different scenarios and error cases
});
