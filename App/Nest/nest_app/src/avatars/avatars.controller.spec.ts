// avatars.controller.spec.ts
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

  const file = {
    path: '/path/to/avatar_test.jpg',
  };

  it('should upload an avatar and return the image URL', async () => {
    const imageUrl = 'https://example.com/avatar.jpg';
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockResolvedValue(imageUrl);

    const req = { user: { sub: 'user-id' } };

    const mockUserDto: CreateUserDto = {
      login: 'john_doe',
      twoFAsecret: 'random_secret',
      isTwoFAEnabled: true,
      isFirstLogin: false,
      // Add other properties as needed...
    };
    jest.spyOn(usersService, 'updateAvatar').mockResolvedValue(mockUserDto);

    const response = await avatarsController.uploadAvatar(file, req);

    expect(response).toEqual({ imageUrl });
    expect(cloudinaryService.uploadAvatar).toHaveBeenCalledWith(file);
    expect(usersService.updateAvatar).toHaveBeenCalledWith('user-id', imageUrl);
  });

  it('should associate the avatar with the session if the user is not authenticated', async () => {
    const imageUrl = 'https://example.com/avatar.jpg';
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockResolvedValue(imageUrl);

    const req = { session: {} };

    jest.spyOn(usersService, 'updateAvatar').mockResolvedValue();

    const response = await avatarsController.uploadAvatar(file, req);

    expect(response).toEqual({ imageUrl });
    expect(cloudinaryService.uploadAvatar).toHaveBeenCalledWith(file);
    expect(req.session.avatarUrl).toBe(imageUrl);
    expect(usersService.updateAvatar).not.toHaveBeenCalled();
  });

  it('should throw an InternalServerErrorException if an error occurs during upload', async () => {
    jest.spyOn(cloudinaryService, 'uploadAvatar').mockRejectedValue(new Error('Upload error'));

    const req = { user: { sub: 'user-id' } };

    await expect(avatarsController.uploadAvatar(file, req)).rejects.toThrowError(
      InternalServerErrorException,
    );
  });
});
