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
		const { name, type, hashedPassword } = createChatroomDto;
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
		const chatRoomInfo : ChatroomInfoDto = {
			id: createdChatroom.id,
			name: createdChatroom.name,
			type: createdChatroom.type,
			joined: true,
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
			where: { id: id, memberShips: { some: { userId: userId } } },
		}) > 0;
		const chatroomDto: ChatroomInfoDto = {
			id: chatRoom.id,
			name: chatRoom.name,
			type: chatRoom.type,
			joined: isJoined,
		}
		return chatroomDto;
	}

	async getChannelNameFromId(chanelId: number): Promise<string> {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({	where: { id: chanelId }, });
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
			bannedUsers: (chatroom.bannedUsers === undefined) ? [] : chatroom.bannedUsers.map(bannedUser => {
				return {
					id: bannedUser.id,	
					username: bannedUser.username,
					avatar: bannedUser.avatar,
				};
			}),
		};
		return current;
	}
	async getAllChannelsContent(userId: number): Promise<ChatroomContentDto[]> {
		// Filter only the channels joined
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
			where: { memberShips: { some: { userId: userId } } },
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
		const isJoined = chatroom.memberShips.some(member => member.userId === userId);
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

		console.log(JSON.stringify(chatRoom, null, 2));
		const isJoined = chatRoom.memberShips.some(memberShip => memberShip.userId === userId);
		if (chatRoom.type === 'public' || chatRoom.type === 'private') {
			if (!isJoined)
				await this.connectUserToChatroom(userId, id);
		}
		else if (chatRoom.type === 'protected') {
			const isValid = await comparePassword(password, chatRoom.hashedPassword);
			if (isValid) {
				if (!isJoined) {
					await this.connectUserToChatroom(userId, id);
				}
			} else {
				throw new Error('Wrong password');
			}
		}
	}

	async kick(id: number, userId: number, kickedId: number) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: {
				 owner: true,
				 memberShips: {
					include: { user: true}
				 }
				},
		});
		// Check if target user is admin
		try {
			const isAdmin = await this.prisma.chatRoom.count({
				where: { 
					id: id, 
					memberShips: { 
						some: { 
							userId: userId,
							isAdmin: true 
						}
					},
				}
			}) > 0;
			console.log("admin: ", isAdmin);
			if (!isAdmin) {
				throw new Error('User is not an admin of this channel');
			}
		} catch (error) {
			throw new Error(error);
		}
		const isTargetOwner = chatRoom.owner.id === kickedId;
		if (isTargetOwner) {
			throw new Error('Cannot kick owner of the channel');
		}
		const kickedMembership = await this.prisma.membership.deleteMany({
			where:
				  { userId: kickedId, chatRoomId: id },
		})
		return kickedMembership;
	}

	async leave(id: number, userId: number) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
			include: { owner: true},
		});
		// Check if target user is admin
		// const isOwner = await this.prisma.chatRoom.count({
		// 	where: { id: id, owner: { id: userId } },
		// }) > 0;
		// Todo: if owner
		// Todo: remove from admin list
		const updateResult = await this.prisma.chatRoom.update({
			where: { id: id },
			data: { members: { disconnect: [{ id: userId }] } },
		});
		return updateResult;
	}

	async addMessageToChannel(channelId: number, userId: number, message: string) {
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
            return chatRoom.hashedPassword || null;
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

	// #endregion
}
