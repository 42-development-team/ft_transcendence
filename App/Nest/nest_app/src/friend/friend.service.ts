import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendDto } from "./friend.dto";

@Injectable()
export class FriendService {
    constructor(
        private prisma: PrismaService,
    ) {}

    /* C(reate) */
    /* R(ead) */
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

	async addFriend(userId: number, addedUserId: number) : Promise<FriendDto>{
		const result = await this.prisma.user.update({
            where: { id: addedUserId },
            data: {
                friendAddedBy: {
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
        return plainToClass(FriendDto, result);
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
