import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, HttpStatus, Query } from '@nestjs/common';
import { Response } from 'express';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { SocketGateway } from '../sockets/socket.gateway';
import { ChatroomInfoDto } from './dto/chatroom-info.dto';
import { UsersService } from 'src/users/users.service';
import { MembershipService } from '../membership/membership.service';
import { Public } from '../auth/public.routes';

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
		const userId: number = req.user.sub;
		if (createChatroomDto.type === 'direct_message') {
			// Check if users blocked each other
			const isUserBlocked = await this.userService.isUserBlocked(userId, Number(createChatroomDto.receiverId));
			if (isUserBlocked) {
				response.send(JSON.stringify("error"));
				return ;
			}
			this.createDirectMessageChannel(createChatroomDto, req, response);
			return ;
		}
        try {
            const newChatRoom = await this.chatroomService.createChatRoom(createChatroomDto, userId);
            this.socketGateway.server.emit("NewChatRoom", newChatRoom.name);
            response.status(HttpStatus.CREATED).send(newChatRoom);
        } catch (error) {
            response.send(JSON.stringify("error"));
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
				await this.chatroomService.connectUserToChatroom(Number(createChatroomDto.receiverId), newChatRoom.id);
				this.socketGateway.server.emit("NewChatRoom", newChatRoom.name);
				const receiverSocketId = await this.userService.getUserSocketFromId(Number(createChatroomDto.receiverId));
				this.socketGateway.clients.find(c => c.id == receiverSocketId)?.emit("directMessage", newChatRoom);
				response.status(HttpStatus.CREATED).send(newChatRoom);
			}
		}
		catch (error) {
			response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				const isMember = await this.membershipService.isChannelMember(
					parseInt(userId),
					parseInt(channelId)
				);
				response.status(HttpStatus.OK).json(isMember);
			} catch (error) {
				response.send(JSON.stringify(error.message));
			}
	}

	/* U(pdate) */
	@Patch(':id/update')
	async update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto, @Request() req: any, @Res() response: Response) {
		const userId: number = req.user.sub;
		try {
			await this.chatroomService.update(+id, updateChatroomDto, userId);
			this.socketGateway.handleChatroomUpdate(id);
			response.send('success');
		}
		catch (error) {
			response.send(JSON.stringify(error.message));
		}
	}

	@Patch(':id/join')
	async join(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const password: string = body.password;
		await this.chatroomService.join(+id, userId, password)
			.then((res) => {
				response.send(res);
			})
			.catch(error => {
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/leave')
	async leave(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const userSocket = await this.userService.getUserSocketFromId(userId);
		await this.chatroomService.leave(+id, userId)
			.then((newOwnerId) => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleLeaveRoom(clientSocket, id);
				if (newOwnerId) {
					this.socketGateway.handleAdminUpdate(clientSocket, newOwnerId, id);
				}
				response.send();
			})
			.catch(error => {
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
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
				response.send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/mute')
	async mute(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const mutedId: number = body.mutedId;
		const muteDuration: number = body.muteDuration;
		const userSocket = await this.userService.getUserSocketFromId(userId);
		await this.chatroomService.mute(+id, userId, mutedId, muteDuration)
			.then(() => {
				const clientSocket = this.socketGateway.clients.find(c => c.id === userSocket);
				this.socketGateway.handleMute(clientSocket, mutedId, id);
				response.send();
			})
			.catch(error => {
				response.send(JSON.stringify(error.message));
			});
	}

	@Patch(':id/invite')
	async invite(@Param('id') id: string, @Request() req: any, @Res() response: Response, @Body() body: any) {
		const userId: number = req.user.sub;
		const invitedLogin = body.invitedLogin;
		const invitedId = await this.userService.getIdFromLogin(invitedLogin);
		if (invitedId){
			const invitedUserSocket = await this.userService.getUserSocketFromId(+invitedId);
			const newMembership = await this.chatroomService.invite(+id, userId, +invitedId);
			if (newMembership) {
				const clientSocket = this.socketGateway.clients.find(c => c.id === invitedUserSocket);
				await this.socketGateway.handleInvite(clientSocket, invitedId, id);
				response.status(HttpStatus.OK).send("ok");
			}
		} else {
			const notInDatabaseMessage = "User invited not found"
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
