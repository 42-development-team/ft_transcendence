import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { MembershipService } from '../membership/membership.service';
import { UsersService } from 'src/users/users.service';

@ApiTags('ChatRoom')
@Controller('chatroom')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService,
		private socketGateway: SocketGateway,
		private userService: UsersService,
	) { }

	/* C(reate) */
	@Post('new')
    async create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any, @Res() response: Response) {
        try {
			const userId: number = req.user.sub;
            const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, userId);
            this.socketGateway.server.emit("NewChatRoom", newChatRoom.name);
            response.status(HttpStatus.CREATED).send(newChatRoom);
        } catch (error) {
            response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
        }
    }

	/* R(ead) */
	@Get('/info')
	async getChannelsInfo(@Request() req: any): Promise<ChatroomInfoDto[]> {
		const userId: number = req.user.sub;
		return this.chatroomService.getAllChannelsInfo(userId);
	}

	@Get('/info/:id')
	async getChannelInfo(@Param('id') id: string, @Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		await this.chatroomService.getChannelInfo(+id, userId)
			.then(chatRoom => {
				response.send(chatRoom);
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Get('/content')
	async getChannelsContent(@Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		await this.chatroomService.getAllChannelsContent(userId)
			.then(chatRooms => {
				response.send(chatRooms);
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Get('/content/:id')
	async getChannelContent(@Param('id') id: string, @Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		await this.chatroomService.getChannelContent(+id, userId)
			.then(chatRoom => {
				response.send(chatRoom);
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	/* U(pdate) */
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto) {
		return this.chatroomService.update(+id, updateChatroomDto);
	}

	@Patch(':id/join')
	async join(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const password: string = body.password;
		await this.chatroomService.join(+id, userId, password)
			.then(() => {
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}
	@Patch(':id/ban')
	async ban(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const bannedId: number = body.bannedId;
		const bannedUserSocket = await this.userService.getUserSocketFromId(bannedId);
		await this.chatroomService.ban(+id, userId, bannedId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === bannedUserSocket);
				this.socketGateway.handleLeaveRoom(clientSocket, id);
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/kick')
	async kick(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const kickedId: number = body.kickedId;
		const kickedUserSocket = await this.userService.getUserSocketFromId(kickedId);
		await this.chatroomService.kick(+id, userId, kickedId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === kickedUserSocket);
				this.socketGateway.handleLeaveRoom(clientSocket, id);
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}
	@Patch(':id/leave')
	async leave(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const userSocket = await this.userService.getUserSocketFromId(userId);
		await this.chatroomService.leave(+id, userId)
			.then((res) => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleLeaveRoom(clientSocket, id);
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}
	
	/* D(elete) */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.chatroomService.remove(+id);
	}
}
