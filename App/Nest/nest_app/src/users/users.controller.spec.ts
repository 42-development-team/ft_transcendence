import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// // import { User } from './user.entity';

// describe('UsersController', () => {
//   let controller: UsersController;
//   let userService: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [UsersService], // Include the UsersService as a provider
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//     userService = module.get<UsersService>(UsersService); // Get an instance of the UsersService
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   it('should create a new user', async () => {
//     const createUserDto: CreateUserDto = {
//       username: 'testuser',
//       email: 'testuser@example.com',
//       avatar: 'avatar-url',
//       password: 'testpassword',
//     };

//     const createdUser: User = {
//       id: 1,
//       ...createUserDto,
//     };

//     // Mock the userService.createUser() method to return the createdUser object
//     jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

//     const result = await controller.create(createUserDto);

//     expect(result).toEqual(createdUser);
//   });
// });
