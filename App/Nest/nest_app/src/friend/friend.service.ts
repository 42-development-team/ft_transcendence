import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendDto } from "./friend.dto";

@Injectable()
export class FriendService {
    constructor(
        private prisma: PrismaService,
		private chatroomService: ChatroomService,
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
        return plainToClass(FriendDto, result);
    }

	async removeDirectMessagesForBlockedUser(blockedId: number, userId: number) : Promise<any> {
		try {
			const chatroom = await this.chatroomService.checkForExistingDirectMessageChannel(blockedId, userId);
			if (chatroom) {
				await this.prisma.chatRoom.delete({
					where: { id: chatroom.id },
				});
			}
			return chatroom;
		}
		catch (error) {
			return undefined;
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