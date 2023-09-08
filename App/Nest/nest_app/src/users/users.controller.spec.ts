import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUsernameDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prismaservice: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, ConfigService, JwtService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prismaservice = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'john_doe',
        username: 'john_doe',
        avatar: 'avatar.png',
        twoFAsecret: 'secret',
        isTwoFAEnabled: false,
        isFirstLogin: true,
		currentStatus: "online",
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(createUserDto as any);

      const result = await controller.create(createUserDto);

      expect(result).toBe(createUserDto);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUsername', () => {
    it('should update the username of a user', async () => {
      const userId = 1;
      const updatedUsernameDto: UpdateUsernameDto = {
        username: 'new_username',
      };

      const updatedUserDto: CreateUserDto = {
        login: 'john_doe',
        username: 'john_doe',
        avatar: 'avatar.png',
        twoFAsecret: 'secret',
        isTwoFAEnabled: false,
        isFirstLogin: true,
		currentStatus: "online",
      };

      jest.spyOn(service, 'updateUsername').mockResolvedValue(updatedUserDto as any);

      const result = await controller.updateUsername(
        updatedUsernameDto,
        userId,
      );

      expect(result).toBe(updatedUserDto);
      expect(service.updateUsername).toHaveBeenCalledWith(
        Number(userId),
        updatedUsernameDto.username,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const userDto1: CreateUserDto = {
        login: 'john_doe',
        username: 'john_doe',
        avatar: 'avatar.png',
        twoFAsecret: 'secret',
        isTwoFAEnabled: false,
        isFirstLogin: true,
		currentStatus: "online",
      };

      const userDto2: CreateUserDto = {
        login: 'john_doe',
        username: 'john_doe',
        avatar: 'avatar.png',
        twoFAsecret: 'secret',
        isTwoFAEnabled: false,
        isFirstLogin: true,
		currentStatus: "online",
      };

      const userDtos: CreateUserDto[] = [userDto1, userDto2];

      jest.spyOn(service, 'getAllUsers').mockResolvedValue(userDtos as any);

      const result = await controller.getAllUsers();

      expect(result).toBe(userDtos);
      expect(service.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
	it('should delete a user', async () => {
	  const userId = 1;
	  jest.spyOn(service, 'deleteUser').mockResolvedValue();

	  await controller.delete(userId);

	  expect(service.deleteUser).toHaveBeenCalledWith(Number(userId));
	  const userExists = await prismaservice.$queryRaw
		'SELECT EXISTS (SELECT 1 FROM user WHERE id = ${userId});';
	  expect(userExists).toBeFalsy;
	});
  });
});
