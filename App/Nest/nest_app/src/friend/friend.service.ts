import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendDto } from "./friend.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class FriendService {
    constructor(
        private prisma: PrismaService,
		private userService: UsersService,
    ) {}

    /* C(reate) */
    /* R(ead) */
	async getFriends(userId: number) : Promise<FriendDto[]> {
		const user = await this.prisma.user.findFirst({
			where: {
				id: userId
			},
			select: {
				friends: true,
			},
		});
		const friends = user.friends;
		const friendDtos: FriendDto[] = [];
		for (let id of friends) {
			const friend = this.userService.getUserFromId(id);
			const friendDto: FriendDto = {
				id: id.toString(),
				userName: (await friend).username,
				avatar: (await friend).avatar,
				currentStatus: (await friend).currentStatus
			};
			friendDtos.push(friendDto);
		}
		return friendDtos;
	}

	async getBlockedUsers(userId: number) : Promise<FriendDto[]> {
		const result = await this.prisma.user.findMany({
			where: {
				blockedBy: {
					some: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
				username: true,
				avatar: true,
				currentStatus: true,
			},
		});
		return plainToClass(FriendDto, result);
	}

    /* U(pdate) */
    async blockUser(blockedId: number, userId: number) : Promise<FriendDto>{
		// Todo: protect against non existing user
        const result = await this.prisma.user.update({
            where: { id: blockedId },
            data: {
                blockedBy: {
                    connect: { id: userId },
                },
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                currentStatus: true,
            },
        });
		// Remove friendship
        return plainToClass(FriendDto, result);
    }

	async addFriend(userId: number, addedUserId: number) {
		// transaction garantee that the 2 updates fail or succed together
		try {
			await this.prisma.$transaction([
				 this.prisma.user.update({
					where: { id: userId },
					data: {
						friendRequestSent: {
							push: addedUserId,
						},
					},
				}),
				 this.prisma.user.update({
					where: { id: addedUserId },
					data: {
						friendRequestGot: {
							push: userId,
						},
					},
				}),
			]);
		} catch (e){
			console.log(e);
		}
	}

    /* D(elete) */
	async unblockUser(blockedId: number, userId: number) : Promise<FriendDto> {
		const result = await this.prisma.user.update({
			where: { id: blockedId },
			data: {
				blockedBy: {
					disconnect: { id: userId },
				},
			},
			select: {
				id: true,
				username: true,
				avatar: true,
				currentStatus: true,
			},
		});
		return plainToClass(FriendDto, result);
	}
}
