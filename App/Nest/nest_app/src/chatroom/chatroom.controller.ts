import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { User } from '@prisma/client'
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'
import { InfoChatroomDto } from './dto/info-chatroom.dto';
import { Public } from '../auth/public.routes'

@ApiTags('ChatRoom')
@Controller('chatroom')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService,
		private socketGateway: SocketGateway,
	) { }

	œ
	/* C(reate) */
	@Public()
	@Post('new')
    async create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any, @Res() response: Response) {
        // const user: User = req.user;

        // createChatroomDto.owner = user.id;
        // createChatroomDto.admins = [user.id];

        try {
            const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, createChatroomDto.owner);

            this.socketGateway.server.emit("NewChatRoom", newChatRoom);

            response.status(HttpStatus.CREATED).send(newChatRoom);
        } catch (error) {
            response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
        }
    }

	/* R(ead) */
	@Get()
	async findAll(@Request() req: any): Promise<InfoChatroomDto[]> {
		const userId: number = req.user.sub;
		return this.chatroomService.findAll(userId);
	}

	@Get(':id')
	async findOne(@Param('id') id: string, @Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		await this.chatroomService.findOne(+id, userId)
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
				// Todo: emit event on socket to join the channel
				// socket.emit(new-connection on channel)
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
