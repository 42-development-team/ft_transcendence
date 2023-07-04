import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
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
                twoFAsecret: createUserDto.twoFAsecret,
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

    async updateUsername(id: number, updatedUsername: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { username: updatedUsername },
        });
        return updatedUser;
    }

    async updateEmail(id: number, updatedEmail: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { email: updatedEmail },
        });
        return updatedUser;
    }

    async updateAvatar(id: number, updatedAvatar: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { avatar: updatedAvatar },
        });
        return updatedUser;
    }

      /* D(elete) */

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}
