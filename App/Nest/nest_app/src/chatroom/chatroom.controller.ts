import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus, Query } from '@nestjs/common';
import { Response } from 'express';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { UsersService } from 'src/users/users.service';
import { MembershipService } from '../membership/membership.service';
import { Public } from '../auth/public.routes';

@ApiTags('ChatRoom')
@Controller('chatroom')
export class ChatroomController {
	constructor(
		private chatroomService: ChatroomService,
		private socketGateway: SocketGateway,
		private userService: UsersService,
		private membershipService: MembershipService,
	) { }

	/* C(reate) */
	@Post('new')
    async create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any, @Res() response: Response) {
		if (createChatroomDto.type === 'direct_message') {
			this.createDirectMessageChannel(createChatroomDto, req, response);
			return ;
		}
        try {
			const userId: number = req.user.sub;
            const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, userId);
            this.socketGateway.server.emit("NewChatRoom", newChatRoom.name);
            response.status(HttpStatus.CREATED).send(newChatRoom);
        } catch (error) {
            response.send("error");
        }
    }

	async createDirectMessageChannel(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any, @Res() response: Response) {
		try {
			const userId: number = req.user.sub;
			try {
				const exisitingDirectMessageChatroom = await this.chatroomService.checkForExistingDirectMessageChannel(userId, Number(createChatroomDto.receiverId));
				if (exisitingDirectMessageChatroom) {
					response.status(HttpStatus.CREATED).send(exisitingDirectMessageChatroom);
					return;
				}
			}
			catch (error) {
				const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, userId);
				const connectSecondUser = await this.chatroomService.connectUserToChatroom(Number(createChatroomDto.receiverId), newChatRoom.id);
				this.socketGateway.server.emit("NewChatRoom", newChatRoom.name);
				const receiverSocketId = await this.userService.getUserSocketFromId(Number(createChatroomDto.receiverId));
				this.socketGateway.clients.find(c => c.id == receiverSocketId)?.emit("directMessage", newChatRoom);
				response.status(HttpStatus.CREATED).send(newChatRoom);
			}
		}
		catch (error) {
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

	@Public()
	@Get('/isMember')
	async isMember(
		@Query('userId') userId: string,
		@Query('channelId') channelId: string,
		@Request() req: any,
		@Res() response: Response) {
			try {
				console.log ("userId logging in in isMember handler: ", userId);
				console.log ("channelId logging in in isMember handler: ", channelId);
				const isMember = await this.membershipService.isChannelMember(
					parseInt(userId),
					parseInt(channelId)
				);
				console.log("isMember = ", isMember);
				response.status(HttpStatus.OK).json(isMember);
			} catch (error) {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			}
	}

	/* U(pdate) */
	@Patch(':id/update')
	async update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto, @Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		try {
			await this.chatroomService.update(+id, updateChatroomDto, userId);
			// Todo: emit on socket
			response.send('success');
		}
		catch (error) {
			response.send(error.message);
		}
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
		let bannedUserSocket = undefined;
		try {
			bannedUserSocket = await this.userService.getUserSocketFromId(bannedId);
		}
		catch (error) {
			console.log("banned user not connected");
		}
		await this.chatroomService.ban(+id, userId, bannedId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === bannedUserSocket);
				this.socketGateway.handleBan(clientSocket, bannedId, id);
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/unban')
	async unban(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const unbannedId: number = body.unbannedId;
		let unbannedUserSocket = undefined;
		try {
			unbannedUserSocket = await this.userService.getUserSocketFromId(unbannedId);
		}
		catch (error) {
			console.log("unbanned user not connected");
		}
		await this.chatroomService.unban(+id, userId, unbannedId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === unbannedUserSocket);
				this.socketGateway.handleUnban(clientSocket, unbannedId, id);
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
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleLeaveRoom(clientSocket, id);
				response.send();
			})
			.catch(error => {
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/setAdmin')
	async setAdmin(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const newAdminId: number = body.newAdminId;
		const userSocket = await this.userService.getUserSocketFromId(userId);
		await this.chatroomService.setAdmin(+id, userId, newAdminId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleAdminUpdate(clientSocket, newAdminId, id);
				response.send();
			})
			.catch(error => {
				// Todo: socket event
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/removeAdmin')
	async removeAdmin(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const removedAdminId: number = body.removedAdminId;
		const userSocket = await this.userService.getUserSocketFromId(userId);
		await this.chatroomService.removeAdmin(+id, userId, removedAdminId)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleAdminUpdate(clientSocket, removedAdminId, id);
				response.send();
			})
			.catch(error => {
				// Todo: socket event
				response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/invite')
	async invite(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const invitedLogin = body.invitedLogin;
		const invitedId = await this.userService.getIdFromLogin(invitedLogin);
		if (invitedId){
			const invitedUserSocket = await this.userService.getUserSocketFromId(+invitedId);
			await this.chatroomService.invite(+id, userId, +invitedId)
				.then(() => {
					const clientSocket = this.socketGateway.clients.find(c => c.id === invitedUserSocket);
					this.socketGateway.handleInvite(clientSocket, invitedId, id);
					response.send("ok");
				})
				.catch(error => {
					response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
				});
		} else {
			const notInDatabaseMessage = "User invited not in database"
			console.log(notInDatabaseMessage);
			response.status(HttpStatus.NOT_FOUND).send({ message: notInDatabaseMessage});
		}
	}

	/* D(elete) */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.chatroomService.remove(+id);
	}
}
