import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client' 
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    /* C(reate) */

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                email: createUserDto.email,
                password: createUserDto.password,
                avatar: createUserDto.avatar,
            }
        });
        return user;
    } 

    /* R(ead) */

    async getAllUser(): Promise<CreateUserDto[]> {
        const users = await this.prisma.user.findMany({
            orderBy: { id: 'asc' },
        });
        const userlistDto = users.map(user => plainToClass(CreateUserDto, user)); // transforming each user object into a DTO object
        return userlistDto;
    }

    /* testing */
    async generateRandomUsers(): Promise<void> {
        const usersToCreate: CreateUserDto[] = [];
      
        for (let i = 0; i < 10; i++) {
          const randomUser: CreateUserDto = {
            id: i + 1,
            username: `User${i + 1}`,
            email: `user${i + 1}@example.com`,
            avatar: `avatar${i + 1}.jpg`,
            password: 'password123',
          };
      
          usersToCreate.push(randomUser);
        }
      
        await Promise.all(usersToCreate.map(user => this.prisma.user.create({ data: user })));
      }
      
}
