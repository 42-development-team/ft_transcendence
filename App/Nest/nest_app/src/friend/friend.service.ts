import { Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ChatroomService } from "src/chatroom/chatroom.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendDto } from "./friend.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class FriendService {
	constructor(
		private prisma: PrismaService,
		private userService: UsersService,
		private chatroomService: ChatroomService,
	) { }

	/* C(reate) */
	/* R(ead) */
	async getFriends(userId: number): Promise<FriendDto[]> {
		const user = await this.prisma.user.findFirst({
			where: { id: userId },
			select: { friends: true },
		});
		const friends = user.friends;
		const friendDtos: FriendDto[] = [];
		for (let id of friends) {
			const friend = this.userService.getUserFromId(id);
			const friendDto: FriendDto = {
				id: id.toString(),
				username: (await friend).username,
				avatar: (await friend).avatar,
				currentStatus: (await friend).currentStatus
			};
			friendDtos.push(friendDto);
		}
		return friendDtos;
	}

	async getInvitedFriends(userId: number): Promise<FriendDto[]> {
		const user = await this.prisma.user.findFirst({
			where: { id: userId },
			select: { sentFriendRequest: true },
		});
		const friends = user.sentFriendRequest;
		const friendDtos: FriendDto[] = [];
		for (let id of friends) {
			const friend = this.userService.getUserFromId(id);
			const friendDto: FriendDto = {
				id: id.toString(),
				username: (await friend).username,
				avatar: (await friend).avatar,
				currentStatus: (await friend).currentStatus
			};
			friendDtos.push(friendDto);
		}
		return friendDtos;
	}

	async getFriendsRequest(userId: number): Promise<FriendDto[]> {
		const user = await this.prisma.user.findFirst({
			where: { id: userId },
			select: { receivedFriendRequest: true },
		});
		const friends = user.receivedFriendRequest;
		const friendDtos: FriendDto[] = [];
		for (let id of friends) {
			const friend = this.userService.getUserFromId(id);
			const friendDto: FriendDto = {
				id: id.toString(),
				username: (await friend).username,
				avatar: (await friend).avatar,
				currentStatus: (await friend).currentStatus
			};
			friendDtos.push(friendDto);
		}
		return friendDtos;
	}

	async getBlockedUsers(userId: number): Promise<FriendDto[]> {
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
	async blockUser(blockedId: number, userId: number): Promise<FriendDto> {
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

	async requestFriend(userId: number, addedUserId: number) {
		// transaction garantee that the 2 updates fail or succed together
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});
			if (user.friends.includes(addedUserId)) {
				return;
			}
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: userId },
					data: {
						sentFriendRequest: { push: addedUserId },
					},
				}),
				this.prisma.user.update({
					where: { id: addedUserId },
					data: {
						receivedFriendRequest: { push: userId },
					},
				}),
			]);
		} catch (e) {
			console.log(e);
		}
	}

	async removeFriend(userId: number, removedUserId: number) {
		// transaction garantee that the 2 updates fail or succed together
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId }
			});
			const updateFriends = user.friends.filter((friendId) => friendId !== removedUserId);
			const userRemoved = await this.prisma.user.findUnique({
				where: { id: removedUserId }
			});
			const updateFriendsRemoved = userRemoved.friends.filter((friendId) => friendId !== userId);
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: userId },
					data: {
						friends: {
							set: updateFriends,
						},
					},
				}),

				this.prisma.user.update({
					where: { id: removedUserId },
					data: {
						friends: {
							set: updateFriendsRemoved,
						},
					},
				}),
			]);
		} catch (e) {
			console.log(e);
		}
	}

	async acceptFriend(userId: number, acceptedUserId: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});
			if (user.friends.includes(acceptedUserId)) {
				return;
			}
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: userId },
					data: {
						friends: { push: acceptedUserId },
						receivedFriendRequest: { set: user.receivedFriendRequest.filter((id) => id !== acceptedUserId) },
					},
				}),
				this.prisma.user.update({
					where: { id: acceptedUserId },
					data: {
						friends: { push: userId },
						sentFriendRequest: { set: user.sentFriendRequest.filter((id) => id !== acceptedUserId) },
					},
				}),
			]);
		}
		catch (e) {
			console.log(e);
		}
	}

	async refuseFriend(userId: number, refusedUserId: number) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});
			await this.prisma.$transaction([
				this.prisma.user.update({
					where: { id: userId },
					data: {
						receivedFriendRequest: { set: user.receivedFriendRequest.filter((id) => id !== refusedUserId) },
					},
				}),
				this.prisma.user.update({
					where: { id: refusedUserId },
					data: {
						sentFriendRequest: { set: user.sentFriendRequest.filter((id) => id !== refusedUserId) },
					},
				}),
			]);
		}
		catch (e) {
			console.log(e);
		}
	}

	async removeFriendInviteForBlockedUser(blockedId: number, userId: number): Promise<any> {
		try {
			const request = await this.prisma.user.update({
				where: { id: blockedId },
				data: {
					sentFriendRequest: {
						set: (await this.prisma.user.findUnique({
							where: { id: blockedId },
							select: { sentFriendRequest: true },
						})).sentFriendRequest.filter((id) => id !== userId),
					},
					receivedFriendRequest: {
						set: (await this.prisma.user.findUnique({
							where: { id: blockedId },
							select: { receivedFriendRequest: true },
						})).receivedFriendRequest.filter((id) => id !== userId),
					},
				},
			});
			return request;
		}
		catch (error) {
			return undefined;
		}
	}

	async removeDirectMessagesForBlockedUser(blockedId: number, userId: number): Promise<any> {
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
	async unblockUser(blockedId: number, userId: number): Promise<FriendDto> {
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
