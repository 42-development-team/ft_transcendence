import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { ChatroomContentDto } from './dto/chatroom-content.dto';

@Injectable()
export class ChatroomService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
        private userService: UsersService,
		private configService: ConfigService
	) { }

	/* C(reate) */

	async createChatRoom(createChatroomDto: CreateChatroomDto, ownerId: number) {
		const { name, type, password } = createChatroomDto;

		const createdChatroom = await this.prisma.chatRoom.create({
			data: {
				name,
				type,
				password,
				owner: { connect: { id: ownerId } },
				admins: { connect: [{ id: ownerId }] },
			},
		});

		return createdChatroom;
	}

	/* R(ead) */
	async getAllChannelsInfo(userId: number): Promise<ChatroomInfoDto[]> {
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
		});
		// Convert to InfoChatroomDto - add joined field
		const chatroomsDtoPromises: Promise<ChatroomInfoDto>[] = chatrooms.map(async chatrooms => {
			const isJoined = await this.prisma.chatRoom.count({
				where: { id: chatrooms.id, members: { some: { id: userId } } },
			}) > 0;
			const current: ChatroomInfoDto = {
				id: chatrooms.id,
				name: chatrooms.name,
				type: chatrooms.type,
				joined: isJoined,
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
			where: { id: id, members: { some: { id: userId } } },
		}) > 0;
		const chatroomDto: ChatroomInfoDto = {
			id: chatRoom.id,
			name: chatRoom.name,
			type: chatRoom.type,
			joined: isJoined,
		}
		return chatroomDto;
	}

	// Content: members and messages

	constructChatroomContentDto(chatroom: any, isJoined: boolean): ChatroomContentDto {
		const current: ChatroomContentDto = {
			id: chatroom.id,
			name: chatroom.name,
			type: chatroom.type,
			joined: isJoined,
			ownerId: chatroom.ownerId,
			members: chatroom.members.map(member => {
				return {
					id: member.id,
					username: member.username,
					avatar: member.avatar,
					isAdmin: chatroom.admins.some(admin => admin.id === member.id),
					isOwner: chatroom.creatorId === member.id,
				};
			}),
			messages: chatroom.messages.map(message => {
				return {
					id: message.id,
					createdAt: message.createdAt,
					content: message.content,
					senderId: message.senderId,
					senderUsername: "test"
				};
			}),
		};
		return current;
	}
	async getAllChannelsContent(userId: number): Promise<ChatroomContentDto[]> {
		// Filter only the channels joined
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
			where: { members: { some: { id: userId } } },
			include: {
				messages: true,
				members: true,
				admins: true,
			},
		});
		// Convert to ChatRoomContentDto - add joined field
		const chatroomsDtoPromises: Promise<ChatroomContentDto>[] = chatrooms.map(async chatroom => {
			const isJoined = await this.prisma.chatRoom.count({
				where: { id: chatroom.id, members: { some: { id: userId } } },
			}) > 0;
			const current: ChatroomContentDto = this.constructChatroomContentDto(chatroom, isJoined);
			return current;
		});
		const chatRoomsDto = await Promise.all(chatroomsDtoPromises);
		return chatRoomsDto;
	}

	async getChannelContent(id: number, userId: number): Promise<ChatroomContentDto> {
		const chatroom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
		});
		const isJoined = await this.prisma.chatRoom.count({
			where: { id: id, members: { some: { id: userId } } },
		}) > 0;
		if (!isJoined) {
			throw new Error('User is not a member of this channel');
		}
		const chatRoomContentDto: ChatroomContentDto = this.constructChatroomContentDto(chatroom, isJoined);
		return chatRoomContentDto;
	}

	/* U(pdate) */
	update(id: number, updateChatroomDto: UpdateChatroomDto) {
		return `This action updates a #${id} chatroom`;
	}

	async join(id: number, userId: number, password: string) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
		});

		// Todo : check if already joined
		if (chatRoom.type === 'public') {
			// Todo: how to check the result of the update?
			const updateResult = await this.prisma.chatRoom.update({
				where: { id: id },
				data: { members: { connect: [{ id: userId }] } },
			});
			return updateResult;
		}
		else if (chatRoom.type === 'private') {
			if (chatRoom.password === password) {
				const updateResult = await this.prisma.chatRoom.update({
					where: { id: id },
					data: { members: { connect: [{ id: userId }] } },
				});
				return updateResult;
			}
			else {
				throw new Error('Wrong password');
			}
		}
		return chatRoom;
	}

	/* D(elete) */
	remove(id: number) {
		return `This action removes a #${id} chatroom`;
	}

	/* Retrieve */
	
	async getUserIdFromSocket(socket: Socket){
		const authToken = socket.handshake.headers.cookie.split(";");
		const jwtToken = authToken[0].split("=")[1];
		const secret = this.configService.get<string>('jwtSecret');
		const payload = this.jwtService.verify(jwtToken, {secret: secret});
		const userId = payload.sub;
		if (userId) {
			return userId;
		}
		// Todo: if userId is undefined or null?
		return null;
	}

    async getUserFromSocket(socket: Socket) {
        const userId = await this.getUserIdFromSocket(socket);
        if (userId) {
            return this.userService.getUserFromId(userId);
        }
    }

	async getPasswordFromChannelName(channelName: string): Promise<string | null> {
        const chatRoom = await this.prisma.chatRoom.findFirst({
            where: { name: channelName },
        });

        if (chatRoom) {
            return chatRoom.password || null;
        }

        return null;
    }

    async getIdFromChannelName(channelName: string): Promise<number | null> {
        const chatRoom = await this.prisma.chatRoom.findFirst({
            where: { name: channelName },
        });

        if (chatRoom) {
            return Number(chatRoom.id);
        }

        return null;
    }
}
