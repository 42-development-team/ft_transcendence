import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { InfoChatroomDto } from './dto/info-chatroom.dto';
import { Socket } from "socket.io";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";

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
	async findAll(userId: number): Promise<InfoChatroomDto[]> {
		const chatrooms = await this.prisma.chatRoom.findMany({
			orderBy: { id: 'asc' },
		});
		// Convert to InfoChatroomDto - add joined field
		const chatRoomsDtoPromises: Promise<InfoChatroomDto>[] = chatrooms.map(async chatrooms => {
			const isJoined = await this.prisma.chatRoom.count({
				where: { id: chatrooms.id, members: { some: { id: userId } } },
			}) > 0;
			const current: InfoChatroomDto = {
				id: chatrooms.id,
				name: chatrooms.name,
				type: chatrooms.type,
				joined: isJoined,
			};
			return current;
		});
		const chatRoomsDto = await Promise.all(chatRoomsDtoPromises);
		return chatRoomsDto;
	}

	async findOne(id: number, userId: number): Promise<InfoChatroomDto> {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
		});
		const isJoined = await this.prisma.chatRoom.count({
			where: { id: id, members: { some: { id: userId } } },
		}) > 0;
		const chatRoomDto: InfoChatroomDto = {
			id: chatRoom.id,
			name: chatRoom.name,
			type: chatRoom.type,
			joined: isJoined,
		}
		return chatRoomDto;
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
            return chatRoom.id;
        }

        return null;
    }
}
