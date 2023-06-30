import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateEmailDto, UpdateUsernameDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prismaservice: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
	prismaservice = new PrismaService();
});

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password',
        avatar: 'avatar.png',
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(createUserDto as any);

      const result = await controller.create(createUserDto);

      expect(result).toBe(createUserDto);
      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateEmail', () => {
    it('should update the email of a user', async () => {
      const userId = 1;
      const updatedEmailDto: UpdateEmailDto = {
        email: 'newemail@example.com',
      };

      const updatedUserDto: CreateUserDto = {
        id: 1,
        username: 'john_doe',
        email: 'newemail@example.com',
        password: 'password',
        avatar: 'avatar.png',
      };

      jest.spyOn(service, 'updateEmail').mockResolvedValue(updatedUserDto as any);

      const result = await controller.updateEmail(updatedEmailDto, userId);

      expect(result).toBe(updatedUserDto);
      expect(service.updateEmail).toHaveBeenCalledWith(
        Number(userId),
        updatedEmailDto.email,
      );
    });
  });

  describe('updateUsername', () => {
    it('should update the username of a user', async () => {
      const userId = 1;
      const updatedUsernameDto: UpdateUsernameDto = {
        username: 'new_username',
      };

      const updatedUserDto: CreateUserDto = {
        id: 1,
        username: 'new_username',
        email: 'john@example.com',
        password: 'password',
        avatar: 'avatar.png',
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
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password',
        avatar: 'avatar.png',
      };

      const userDto2: CreateUserDto = {
        id: 2,
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'password',
        avatar: 'avatar.png',
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
	//   const deletedUserDto: CreateUserDto = {
	// 	id: 2,
	// 	username: 'jqhns_doe',
	// 	email: 'joh@exsaqmple.com',
	// 	password: 'passsqword',
	// 	avatar: 'avatasrq.png',
	//   };
	  jest.spyOn(service, 'deleteUser').mockResolvedValue();
	//   await controller.create(deletedUserDto);
	//   console.log(deletedUserDto);

	  await controller.delete(userId);

	  expect(service.deleteUser).toHaveBeenCalledWith(Number(userId));
	  const userExists = await prismaservice.$queryRaw
		'SELECT EXISTS (SELECT 1 FROM user WHERE id = ${userId});';
	  expect(userExists).toBeFalsy;
	//   console.log(userExists);
	});
  });
});
