import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { Prisma, User } from '@prisma/client'
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
                login: createUserDto.login,
                username: createUserDto.username,
                avatar: createUserDto.avatar,
                twoFAsecret: createUserDto.twoFAsecret,
				currentStatus: createUserDto.currentStatus,
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
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id },
        });
        const userDto = plainToClass(CreateUserDto, user);
        return userDto;
    }

    async getUserSocketFromId(id: number): Promise<string> {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id },
        });
        return user.socketId;
    }

    async getUserFromUsername(username: string): Promise<CreateUserDto> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { username },
            });
            const userDto = plainToClass(CreateUserDto, user);
            return userDto;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    async getUserFromLogin(login: string): Promise<CreateUserDto> {
        try {

            const user = await this.prisma.user.findUniqueOrThrow({
                where: { login },
            });
            const userDto = plainToClass(CreateUserDto, user);
            return userDto;
        }
        catch (error) {
            console.log(error.message);
        }
    }

    /* U(pdate) */

    async updateUsername(id: number, updatedUsername: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { username: updatedUsername },
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

    async updateSocketId(id: number, updatedSocketId: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { socketId: updatedSocketId },
        });
        return updatedUser;
    }

      /* D(elete) */

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }

    /* Retreiving or creating a user when authenticating*/

    async createOrFindUser(login: string): Promise<CreateUserDto & { id?: number }> {
        let user = await this.getUserFromLogin(login);

        if (!user) {
            const createUserDto: CreateUserDto = {
            login: login,
            username: login,
            avatar: "noavatar.jpg",
            isTwoFAEnabled: false,
            twoFAsecret: "",
            isFirstLogin: true,
			currentStatus: "online",
            };

            user = await this.createUser(createUserDto) as CreateUserDto;
        }
		else {
			if (user.currentStatus != "online")
				user.currentStatus = "online";
		}
        // console.log("user: ", user);
        return user;
    }

}
