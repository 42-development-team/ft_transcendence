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

    async getAllUsers(): Promise<CreateUserDto[]> {
        const users = await this.prisma.user.findMany({
            orderBy: { id: 'asc' },
        });
        const userlistDto = users.map(user => plainToClass(CreateUserDto, user)); // transforming each user object into a DTO object
        return userlistDto;
    }

    async getUserFromId(id: number): Promise<CreateUserDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            rejectOnNotFound: true,
        });
        const userDto = plainToClass(CreateUserDto, user);
        return userDto;
    }

    async getUserFromUsername(username: string): Promise<CreateUserDto> {
        const user = await this.prisma.user.findUnique({
            where: { username },
            rejectOnNotFound: true,
        });
        const userDto = plainToClass(CreateUserDto, user);
        return userDto;
    }

    /* U(pdate) */

    async updateUsername(username: string, updatedUsername: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { username },
            data: { username: updatedUsername },
        });
        return updatedUser;
    }

    async updateEmail(username: string, updatedEmail: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { username },
            data: { email: updatedEmail },
        });
        return updatedUser;
    }

    async updateAvatar(username: string, updatedAvatar: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { username },
            data: { avatar: updatedAvatar },
        });
        return updatedUser;
    }

    /* testing */
    // async generateRandomUsers(): Promise<void> {
    //     const usersToCreate: CreateUserDto[] = [];
      
    //     for (let i = 0; i < 10; i++) {
    //       const randomUser: CreateUserDto = {
    //         id: i + 1,
    //         username: `User${i + 1}`,
    //         email: `user${i + 1}@example.com`,
    //         avatar: `avatar${i + 1}.jpg`,
    //         password: 'password123',
    //       };
      
    //       usersToCreate.push(randomUser);
    //     }
      
    //     await Promise.all(usersToCreate.map(user => this.prisma.user.create({ data: user })));
    //   }
      
}
