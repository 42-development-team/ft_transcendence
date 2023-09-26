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
        try {
            const users = await this.prisma.user.findMany({
                orderBy: { id: 'asc' },
            });
            const userlistDto = users.map(user => plainToClass(CreateUserDto, user)); // transforming each user object into a DTO object
            return userlistDto;
        }
        catch (e) {
            console.log(e);
        }
    }

    async getUserFromId(id: number): Promise<CreateUserDto> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { id: id },
            });
            const userDto = plainToClass(CreateUserDto, user);
            return userDto;
        }
        catch (e) {
            console.log(e);
        }
    }

    async getSocketIdsFromUserId(id: number): Promise<string[]> {
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { id: id },
            });
            return user.socketIds;
        }
        catch (e) {
            console.log(e);
        }
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
        try {
            const user = await this.prisma.user.findFirst({
                where: { login: login },
            });
            if(user) {
                return user.id;
            }
            return null;
        }
        catch (e) {
            console.log(e);
        }
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
        try {
			const user = await this.prisma.user.findFirst({
				where: {
					id: blockedId,
					blockedBy: {
						some: { id: userId },
					},
				},
			});
			return user !== null;
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

    async addSocketId(id: number, updatedSocketId: string): Promise<CreateUserDto> {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: id },
                data: { socketIds: { push: updatedSocketId } },
            });
            return updatedUser;
        } catch (error) {
            console.log("Add socket: " + error.message);
        }
    }
    
    async removeSocketId(id: number, removedSocketId: string): Promise<CreateUserDto> {
        // Remove socketId from user
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: { id: id },
            });
            const newSocketIds = user.socketIds.filter(socketId => socketId !== removedSocketId);
            const updatedUser = await this.prisma.user.update({
                where: { id: id },
                data: { socketIds: { set: newSocketIds } },
            });
            return updatedUser;
        }
        catch (error) {
            console.log("Remove socket: " + error.message);
        }
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
            const duplicate = await this.getUserFromUsername(login);
            let newUsername = login;
            if (duplicate) {
                let number = 1;
                while (await this.getUserFromUsername(login + "(" + number + ")")) {
                    number++;
                }
                newUsername = login + "(" + number + ")";
            }
            const createUserDto: CreateUserDto = {
                login: login,
                username: newUsername,
                avatar: "noavatar.jpg",
                isTwoFAEnabled: false,
                twoFAsecret: "",
                isFirstLogin: true,
                currentStatus: "online",
                socketIds: [],
            };
            user = await this.createUser(createUserDto) as CreateUserDto;
        }
        else if (user && user.currentStatus != "online") {
            user.currentStatus = "online";
			await this.prisma.user.update({
                where: { login: user.login},
                data: { currentStatus: "online" },
            });
        }
        return user;
    }

}
