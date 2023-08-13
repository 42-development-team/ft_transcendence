import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { Public } from '../auth/public.routes'
import { JoinRequestDto } from './dto/chatroom-join.dto';

@ApiTags('ChatRoom')
@Controller('chatroom')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService,
		private socketGateway: SocketGateway,
	) { }

	/* C(reate) */
	@Post('new')
    async create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any, @Res() response: Response) {
        try {
            const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, createChatroomDto.owner);

            this.socketGateway.server.emit("NewChatRoom", newChatRoom);

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

	/* D(elete) */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.chatroomService.remove(+id);
	}
}
