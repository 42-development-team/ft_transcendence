import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsController } from './avatars.controller';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';
import { InternalServerErrorException } from '@nestjs/common'; 
import { CreateUserDto } from '../users/dto';

describe('AvatarsController', () => {
  let avatarsController: AvatarsController;
  let cloudinaryService: CloudinaryService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarsController],
      providers: [CloudinaryService, UsersService],
    }).compile();

    avatarsController = module.get<AvatarsController>(AvatarsController);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    usersService = module.get<UsersService>(UsersService);
  });

  // Mock the file object (replace this with a proper mocked file object)
  const file = {
    path: '/path/to/avatar_test.jpg',
  };

  it('should upload an avatar and return the image URL', async () => {
    // Mock the cloudinaryService's uploadAvatar method to return a URL
    const imageUrl = 'https://example.com/avatar.jpg';
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockResolvedValue(imageUrl);

    // Mock the req object to have a user property (simulating authentication)
    const req = { user: { sub: 'user-id' } };

    // Mock the usersService's updateAvatar method
    const mockUserDto: CreateUserDto = {
        login: 'john_doe',
        twoFAsecret: 'random_secret',
        isTwoFAEnabled: true,
        isFirstLogin: false,
        // Add other properties as needed...
      };    jest.spyOn(usersService, 'updateAvatar').mockResolvedValue(mockUserDto);


    // Execute the uploadAvatar method
    const response = await avatarsController.uploadAvatar(file, req);

    // Assertions
    expect(response).toEqual({ imageUrl });
    expect(cloudinaryService.uploadAvatar).toHaveBeenCalledWith(file);
    expect(usersService.updateAvatar).toHaveBeenCalledWith('user-id', imageUrl);
  });

  it('should associate the avatar with the session if the user is not authenticated', async () => {
    // Mock the cloudinaryService's uploadAvatar method to return a URL
    const imageUrl = 'https://example.com/avatar.jpg';
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockResolvedValue(imageUrl);

    // Mock the req object to have no user property (simulating no authentication)
    const req = { session: {} };

    // Mock the usersService's updateAvatar method
    jest.spyOn(usersService, 'updateAvatar').mockResolvedValue();

    // Execute the uploadAvatar method
    const response = await avatarsController.uploadAvatar(file, req);

    // Assertions
    expect(response).toEqual({ imageUrl });
    expect(cloudinaryService.uploadAvatar).toHaveBeenCalledWith(file);
    expect(req.session.avatarUrl).toBe(imageUrl);
    expect(usersService.updateAvatar).not.toHaveBeenCalled(); // The updateAvatar method should not be called in this case
  });

  it('should throw an InternalServerErrorException if an error occurs during upload', async () => {
    // Mock the cloudinaryService's uploadAvatar method to throw an error
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockRejectedValue(new Error('Upload error'));

    // Mock the req object
    const req = { user: { sub: 'user-id' } };

    // Execute the uploadAvatar method and expect it to throw an InternalServerErrorException
    await expect(avatarsController.uploadAvatar(file, req)).rejects.toThrowError(
      InternalServerErrorException,
    );
  });
});
