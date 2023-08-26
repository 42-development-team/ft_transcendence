import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../users/users.service";
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { ChatroomContentDto } from './dto/chatroom-content.dto';
import { comparePassword } from '../utils/bcrypt';

@Injectable()
export class ChatroomService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UsersService,
		private configService: ConfigService,
	) { }

	// #region C(reate)

	async createChatRoom(createChatroomDto: CreateChatroomDto, ownerId: number) {
		const { name, type, hashedPassword, receiverId } = createChatroomDto;
		const createdChatroom = await this.prisma.chatRoom.create({
			data: {
				name,
				type,
				hashedPassword,
				owner: { connect: { id: ownerId } },
				memberShips: {
					create: {
						user: { connect: { id: ownerId } },
						isAdmin: true,
					}
				},
			},
		});
		const chatRoomInfo: ChatroomInfoDto = {
			id: createdChatroom.id,
			name: createdChatroom.name,
			type: createdChatroom.type,
			joined: true,
			banned: false,
		}
		return chatRoomInfo;
	}
	// #endregion

	// #region R(ead)
	async getAllChannelsInfo(userId: number): Promise<ChatroomInfoDto[]> {
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
		});
		// Convert to InfoChatroomDto - add joined field
		const chatroomsDtoPromises: Promise<ChatroomInfoDto>[] = chatrooms.map(async chatrooms => {
			const isJoined = await this.prisma.chatRoom.count({
				where: { id: chatrooms.id, memberShips: { some: { userId: userId } } },
			}) > 0;
			const isBanned = await this.prisma.chatRoom.count({
				where: { id: chatrooms.id, memberShips: { some: { userId: userId, isBanned: true } } },
			}) > 0;
			const current: ChatroomInfoDto = {
				id: chatrooms.id,
				name: chatrooms.name,
				type: chatrooms.type,
				joined: isJoined,
				banned: isBanned,
			};
			return current;
		});
		const chatroomsDto = await Promise.all(chatroomsDtoPromises);
		return chatroomsDto;
	}

	async getChannelInfo(id: number, userId: number): Promise<ChatroomInfoDto> {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
		});
		const isJoined = await this.prisma.chatRoom.count({
			where: { id: id, memberShips: { some: { userId: userId, isBanned: false } } },
		}) > 0;
		const isBanned = await this.prisma.chatRoom.count({
			where: { id: id, memberShips: { some: { userId: userId, isBanned: true } } },
		}) > 0;
		const chatroomDto: ChatroomInfoDto = {
			id: chatRoom.id,
			name: chatRoom.name,
			type: chatRoom.type,
			joined: isJoined,
			banned: isBanned,
		}
		return chatroomDto;
	}

	async getChannelNameFromId(chanelId: number): Promise<string> {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({ where: { id: chanelId }, });
		return chatRoom.name;
	}

	// Content: members and messages

	constructChatroomContentDto(chatroom: any): ChatroomContentDto {
		const current: ChatroomContentDto = {
			id: chatroom.id,
			name: chatroom.name,
			type: chatroom.type,
			ownerId: chatroom.ownerId,
			// members: [],
			members: (chatroom.memberShips === undefined) ? [] : chatroom.memberShips.map(member => {
				return {
					id: member.userId,
					username: member.user.username,
					isAdmin: member.isAdmin,
					isOwner: chatroom.owner.id === member.userId,
					isBanned: member.isBanned,
				};
			}),
			messages: (chatroom.messages === undefined) ? [] : chatroom.messages.map(message => {
				return {
					id: message.id,
					createdAt: message.createdAt,
					content: message.content,
					sender: message.sender,
				};
			}),
		};
		return current;
	}
	async getAllChannelsContent(userId: number): Promise<ChatroomContentDto[]> {
		// Filter only the channels joined
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
			where: { memberShips: { some: { userId: userId, isBanned: false } } },
			include: {
				messages: {
					include: { sender: true }
				},
				owner: true,
				memberShips: {
					include: { user: true }
				}
			},
		});
		const chatroomsDtoPromises: Promise<ChatroomContentDto>[] = chatrooms.map(async chatroom => {
			const current: ChatroomContentDto = this.constructChatroomContentDto(chatroom);
			return current;
		});
		return await Promise.all(chatroomsDtoPromises);
	}

	async getChannelContent(id: number, userId: number): Promise<ChatroomContentDto> {
		const chatroom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: {
				messages: {
					include: { sender: true }
				},
				owner: true,
				memberShips: {
					include: { user: true }
				}
			},
		});
		const isJoined = chatroom.memberShips.some(member => member.userId === userId && member.isBanned == false);
		if (!isJoined) {
			throw new Error('User is not a member of this channel');
		}
		return this.constructChatroomContentDto(chatroom);
	}
	// #endregion


	// #region U(pdate)
	update(id: number, updateChatroomDto: UpdateChatroomDto) {
		return `This action updates a #${id} chatroom`;
	}

	async connectUserToChatroom(userId: number, chatroomId: number) {
		const createdMembership = await this.prisma.membership.create({
			data: {
				user: { connect: { id: userId } },
				chatroom: { connect: { id: chatroomId } },
			},
		});
		return createdMembership;
	}

	async join(id: number, userId: number, password: string) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: { memberShips: true },
		});

		const isBanned = chatRoom.memberShips.some(memberShip => memberShip.userId === userId && memberShip.isBanned == true);
		if (isBanned) {
			throw new Error('User is banned from this channel');
		}
		const isJoined = chatRoom.memberShips.some(memberShip => memberShip.userId === userId);
		if (chatRoom.type === 'protected') {
			const isValid = await comparePassword(password, chatRoom.hashedPassword);
			if (!isValid) {
				throw new Error('Wrong password');
			}
		}
		if (!isJoined)
			return await this.connectUserToChatroom(userId, id);
	}

	async isUserAdmin(userId: number, chatroomId: number) {
		return await this.prisma.membership.count({
			where: {
				userId: userId,
				chatRoomId: chatroomId,
				isAdmin: true,
				isBanned: false
			}
		}) > 0;
	}

	async kick(id: number, userId: number, kickedId: number) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: {
				owner: true,
				memberShips: {
					include: { user: true }
				}
			},
		});
		const isAdmin = this.isUserAdmin(userId, id);
		const isOwner = chatRoom.owner.id === userId;
		const isTargetOwner = chatRoom.owner.id === kickedId;
		if (!isAdmin && !isOwner) {
			throw new Error('User is not an admin of this channel');
		}
		if (isTargetOwner) {
			throw new Error('Cannot kick owner of the channel');
		}
		const kickedMembership = await this.prisma.membership.deleteMany({
			where:
				{ userId: kickedId, chatRoomId: id },
		})
		return kickedMembership;
	}

	async ban(id: number, userId: number, bannedId: number) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: {
				owner: true,
				memberShips: {
					include: { user: true }
				}
			},
		});
		const isAdmin = this.isUserAdmin(userId, id);
		const isOwner = chatRoom.owner.id === userId;
		const isTargetOwner = chatRoom.owner.id === bannedId;
		// const isTargetAdmin = this.isUserAdmin(bannedId, id);	// Todo: can admins kick each other?
		if (!isAdmin && !isOwner) {
			throw new Error('User is not an admin of this channel');
		}
		if (isTargetOwner) {
			throw new Error('Cannot kick owner of the channel');
		}
		// Add banned user to ban list
		const bannedUser = await this.prisma.membership.updateMany({
			where: { userId: bannedId, chatRoomId: id },
			data: { isBanned: true },
		});
		return bannedUser;
	}

	async unban(id: number, userId: number, unbannedId: number) {
		const isAdmin = this.isUserAdmin(userId, id);
		const isTargetBanned = await this.prisma.membership.count({
			where: { userId: unbannedId, chatRoomId: id, isBanned: true },
		}) > 0;
		if (!isTargetBanned) {
			throw new Error('User is not banned in this channel');
		}
		if (!isAdmin) {
			throw new Error('You need channel admin rights to unban a user');
		}
		// Remove banned user from membership lsit
		const unbannedUser = await this.prisma.membership.deleteMany({
			where: { userId: unbannedId, chatRoomId: id, isBanned: true },
		});
		return unbannedUser;
	}

	async leave(id: number, userId: number) {
			// const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			// 	where: { id: id },
			// 	include: { owner: true },
			// });

			// Todo: if owner transmit ownership to another member (admin)
			// const isOwner = await this.prisma.chatRoom.count({
			// 	where: { id: id, owner: { id: userId } },
			// }) > 0;
			const kickedMembership = await this.prisma.membership.deleteMany({
				where:
					{ userId: userId, chatRoomId: id },
			});
			return kickedMembership;
		}

	async addMessageToChannel(channelId: number, userId: number, message: string) {
		// Todo: if user is banned refuse
		const newMessage = await this.prisma.message.create({
			data: {
				content: message,
				senderId: userId,
				chatRoomId: channelId,
			},
		});
		const test = await this.prisma.message.findUnique({
			where: { id: newMessage.id },
			include: {
				sender: true,
			},
		});
		return test;
	}

	// #endregion

	// #region D(elete)
	remove(id: number) {
		return `This action removes a #${id} chatroom`;
	}

	// #endregion
	// #region Retrieve

	async getUserIdFromSocket(socket: Socket){
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

    async getUserFromSocket(socket: Socket) {
		const userId = await this.getUserIdFromSocket(socket);
		if(userId) {
			return this.userService.getUserFromId(userId);
		}
	}

	async getPasswordFromChannelName(channelName: string): Promise < string | null > {
		const chatRoom = await this.prisma.chatRoom.findFirst({
			where: { name: channelName },
		});

		if(chatRoom) {
			return chatRoom.hashedPassword || null;
		}

		return null;
	}

    async getIdFromChannelName(channelName: string): Promise < number | null > {
		const chatRoom = await this.prisma.chatRoom.findFirst({
			where: { name: channelName },
		});

		if(chatRoom) {
			return Number(chatRoom.id);
		}

        return null;
	}

	// #endregion
}
