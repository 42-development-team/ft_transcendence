import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { plainToClass } from 'class-transformer';
import { InfoChatroomDto } from './dto/info-chatroom.dto';

@Injectable()
export class ChatroomService {
	constructor(
		private prisma: PrismaService,
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

	async join(id: number, userId: number) {
		const chatRoom = await this.prisma.chatRoom.findUniqueOrThrow({
			where: { id: id },
		});
		// Todo : check if already joined
		if (chatRoom.type === 'public') {
			await this.prisma.chatRoom.update({
				where: { id: id },
				data: { members: { connect: [{ id: userId }] } },
			});
		}
		else if (chatRoom.type === 'private') {
			// Todo: ask for password
		}
		return chatRoom;
	}

	/* D(elete) */
	remove(id: number) {
		return `This action removes a #${id} chatroom`;
	}
}
