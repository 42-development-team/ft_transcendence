import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client'
import { plainToClass } from 'class-transformer';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService,
    ) { }

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
            where: { id: id },
        });
        const userDto = plainToClass(CreateUserDto, user);
        return userDto;
    }

    async getUserSocketFromId(id: number): Promise<string> {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: id },
        });
        return user.socketId;
    }

    async getUserIdFromSocket(socket: Socket){
		if (socket){
			const authToken = socket.handshake.headers.cookie.split(";");
			const jwtToken = authToken[0].split("=")[1];
			const secret = this.configService.get<string>('jwtSecret');
			const payload = this.jwtService.verify(jwtToken, { secret: secret });
			const userId = payload.sub;
			if(userId) {
				return userId;
			}
			// Todo: if userId is undefined or null?
			return null;
		}
		return null;
	}

    async getUserFromUsername(username: string): Promise<CreateUserDto> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { username: username },
            });
            const userDto = plainToClass(CreateUserDto, user);
            return userDto;
        }
        catch (error) {
            console.log(error.message);
        }
    }

	async getIdFromLogin(login: string): Promise < number | null > {
		const user = await this.prisma.user.findFirst({
			where: { login: login },
		});
		// console.log("user in getIdFromLogin", user);

		if(user) {
			return user.id;
		}
        return null;
	}

    async getUserFromLogin(login: string): Promise<CreateUserDto> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { login: login },
            });
            const userDto = plainToClass(CreateUserDto, user);
            return userDto;
        }
        catch (error) {
            console.log(error.message);
        }
    }

	async getCurrentStatusFromId(id: number): Promise<string> {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: id },
        });
        const userCurrentStatus = user.currentStatus;
        return userCurrentStatus;
    }

    async isUserBlocked(blockedId: number, userId: number): Promise<boolean> {
        console.log("blockedId: ", blockedId);
        try {
            // Check if user is blocked by the blockedId user
            await this.prisma.user.findUniqueOrThrow({
                where: { blockedBy: { some: { id: userId } }, id: blockedId },
            });
            return true;
        }
        catch (error) {
            return false;
        }
        return false;
    }

    /* U(pdate) */

    async updateUsername(id: number, updatedUsername: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id: id },
            data: { username: updatedUsername },
        });
        return updatedUser;
    }

    async updateAvatar(id: number, updatedAvatar: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id: id },
            data: { avatar: updatedAvatar },
        });
        return updatedUser;
    }

    async updateSocketId(id: number, updatedSocketId: string): Promise<CreateUserDto> {
        const updatedUser = await this.prisma.user.update({
            where: { id: id },
            data: { socketId: updatedSocketId },
        });
        return updatedUser;
    }

    async updateStatus(id: number, newStatus: string) {
        await this.prisma.user.update({
            where: { id: id },
            data: { currentStatus: newStatus },
        });
    }

    /* D(elete) */

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id: id },
        });
    }

    /* Retreiving or creating a user when authenticating*/

    async createOrFindUser(login: string): Promise<CreateUserDto & { id?: number }> {
        let user = await this.getUserFromLogin(login);
		// console.log("Logging in user current status= ", user.currentStatus);
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
            const duplicate = await this.getUserFromUsername(login);
            if (duplicate) {
                let number = 1;
                while (await this.getUserFromUsername(login + "(" + number + ")")) {
                    number++;
                }
                await this.prisma.user.update({
                    where: { username: login },
                    data: { username: login + '(' + number + ')' },
                });
            }
            user = await this.createUser(createUserDto) as CreateUserDto;
        }
        else if (user && user.currentStatus != "online") {
			// console.log("current user != online for user: ", user.username);
            user.currentStatus = "online";
			await this.prisma.user.update({
                where: { login: user.login},
                data: { currentStatus: "online" },
            });
        }
        return user;
    }

}
