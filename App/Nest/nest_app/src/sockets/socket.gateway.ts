import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChatroomService } from '../chatroom/chatroom.service';
import { UsersService } from '../users/users.service'
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
@WebSocketGateway({
	cors: {
		credentials: true,
	}
})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private chatroomService: ChatroomService,
		private userService: UsersService,
		private memberShipService: MembershipService,
	) { }

	@WebSocketServer()
	server: Server;

	clients: Socket[] = [];

	async handleConnection(client: Socket) {
		const userId = await this.userService.getUserIdFromSocket(client);
		if (userId) {
			console.log('Client connected: ' + client.id);
			await this.userService.updateSocketId(userId, client.id);
			this.clients.push(client);
			const userStatus = await this.userService.getCurrentStatusFromId(userId);
			this.server.emit("userLoggedIn", { userId });
			// todo: Check for verifiedJWT in socket and disconnect if not OK
			// and retrieve all the channels the user is a member of
		} else {
			console.log('User not authenticated');
			client.disconnect();
		}
	}

	async handleDisconnect(client: Socket) {
		console.log('Client disconnected: ' + client.id);
		const userId = await this.userService.getUserIdFromSocket(client);
		await this.userService.updateSocketId(userId, null);
		this.clients = this.clients.filter(c => c.id !== client.id);
		// const userStatus = await this.userService.getCurrentStatusFromId(userId);
		this.server.emit("userLoggedOut", { userId });
	}

	@SubscribeMessage('joinRoom')
	async joinRoom(client: Socket, room: string) {
		const userId = await this.userService.getUserIdFromSocket(client);
		const chatRoomId = await this.chatroomService.getIdFromChannelName(room);
		const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, chatRoomId);
		console.log(`Client ${user.username} (${client.id}) joined room ${room}`);
		this.server.to(room).emit('newConnectionOnChannel',
			{ room, user }
		);
		client.join(room);
	}

	@SubscribeMessage('leaveRoom')
	async handleLeaveRoom(client: Socket, roomId: string) {
		const userId = await this.userService.getUserIdFromSocket(client);
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		client.leave(room);
		client.emit('leftRoom', { room });
		console.log(`Client ${userId} (${client.id}) left room ${room}`);
		this.server.to(room).emit('newDisconnecgit checkout -b FT-361-fix-joining-game-with-only-one-usertionOnChannel', { room, userId });
	}

	@SubscribeMessage('message')
	async handleMessage(
		@MessageBody() body: any,
		@ConnectedSocket() client: Socket
	): Promise<void> {
		const userId = await this.userService.getUserIdFromSocket(client);
		const { roomId, message } = body;
		const newMessage = await this.chatroomService.addMessageToChannel(roomId, userId, message);
		if (!newMessage) {
			console.log(`Users (${userId}) can not send message channel (${roomId})`)
			return;
		}
		const room = await this.chatroomService.getChannelNameFromId(roomId);
		this.server.to(room).emit('new-message',
			{ newMessage, room }
		);
	}

	async handleChatroomUpdate(roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		this.server.emit('chatroomUpdate', { room });
	}

	async handleBan(client: Socket, userId: number, roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
		if (client) {
			client.leave(room);
			client.emit('leftRoom', { room });
			console.log(`Client ${userId} (${client.id}) banned from room ${room}`);
		} else {
			console.log(`Client ${userId} banned from room ${room}`);
		}
		this.server.to(room).emit('newConnectionOnChannel', { room, user });
	}

	async handleUnban(client: Socket, userId: number, roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		if (client) {
			client.emit('NewChatRoom', { room });
			console.log(`Client ${userId} (${client.id}) unbanned from room ${room}`);
		} else {
			console.log(`Client ${userId} unbanned from room ${room}`);
		}
		this.server.to(room).emit('newDisconnectionOnChannel', { room, userId });
	}

	async handleMute(client: Socket, userId: number, roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		if (client) {
			console.log(`Client ${userId} (${client.id}) muted in room ${room}`);
		} else {
			console.log(`Client ${userId} muted in room ${room}`);
		}
		const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
		this.server.to(room).emit('newConnectionOnChannel', { room, user });
	}

	async handleAdminUpdate(client: Socket, userId: number, roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		if (client) {
			console.log(`Client ${userId} (${client.id}) updated admin status in room ${room}`);
		} else {
			console.log(`Client ${userId} updated admin status in room ${room}`);
		}
		const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
		this.server.to(room).emit('newConnectionOnChannel', { room, user });
	}

	async handleInvite(client: Socket, userId: number, roomId: string) {
		const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
		const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
		if (client) {
			client.join(room);
			client.emit('invitedRoom', { room });
			console.log(`Client ${userId} (${client.id}) invited to room ${room}`);
		} else {
			console.log(`Client ${userId} invited to room ${room}`);
		}
		this.server.to(room).emit('userInvited', { room, user });
		this.server.to(room).emit('newConnectionOnChannel', { room, user });
	}

	// Friend related events
	async handleFriendUpdate(userId: number, friendId: number) {
		const userSocketId = await this.userService.getUserSocketFromId(userId);
		const userSocket = this.clients.find(c => c.id === userSocketId);
		if (userSocket) {
			userSocket.emit('friendUpdate', { friendId });
		}
		const friendSocketId = await this.userService.getUserSocketFromId(friendId);
		const friendSocket = this.clients.find(c => c.id === friendSocketId);
		if (friendSocket) {
			friendSocket.emit('friendUpdate', { userId });
		}
	}
	
	async handleBlockUpdate(userId: number) {
		const userSocketId = await this.userService.getUserSocketFromId(userId);
		const userSocket = this.clients.find(c => c.id === userSocketId);
		if (userSocket) {
			userSocket.emit('blockUpdate', { userId });
			console.log("Block update sent to:" + userId);
		}
	}
}
