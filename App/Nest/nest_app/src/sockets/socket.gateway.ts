import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChatroomService } from '../chatroom/chatroom.service';
import { UsersService } from '../users/users.service'
import { MembershipService } from 'src/membership/membership.service';
import { GameService } from 'src/game/game.service';
import { GameDto, PlayerDto, BallDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { UserIdDto } from 'src/userstats/dto/user-id.dto';
import { forEachChild } from 'typescript';

@Injectable()
@WebSocketGateway({cors:{
    credentials: true,
}})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private chatroomService: ChatroomService,
        private gameService: GameService,
        private userService: UsersService,
        private memberShipService: MembershipService
        ) {}

    @WebSocketServer()
    server: Server;

    clients: Socket[] = [];
    gameRooms: GameRoomDto[] = [];
    queued: UserIdDto[] = [];

     // The client object is an instance of the Socket class provided by the Socket.io library.
     // handleConnection is a method predefined on OnGatewayConnection. We can't change the name
     // why "(client: Socket)" ? because client is an instance of Socket class
    async handleConnection(client: Socket){
        console.log('Client connected: ' + client.id);
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        await this.userService.updateSocketId(userId, client.id);
        this.clients.push(client);
        // todo: Check for verifiedJWT in socket and disconnect if not OK
        // and retrieve all the channels the user is member of
    }

    // handleDisconnect is a predefined method of the OnGatewayDisconnect interface
    async handleDisconnect(client: Socket){
        console.log('Client disconnected: ' + client.id);
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        await this.userService.updateSocketId(userId, null);
        this.clients = this.clients.filter(c => c.id !== client.id);
        // add logic for:
        // remove
    }

    @SubscribeMessage('joinRoom')
    async joinRoom(client: Socket, room: string){
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        const chatRoomId = await this.chatroomService.getIdFromChannelName(room);
        const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, chatRoomId);
        console.log(`Client ${user.username} (${client.id}) joined room ${room}`);
        this.server.to(room).emit('newConnectionOnChannel', 
            {room, user}
        );
        client.join(room);
    }

    async handleBan(client: Socket, userId: number, roomId: string ) {
        const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
        const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
        if (client) {
            client.leave(room);
            client.emit('leftRoom', { room });
            console.log(`Client ${userId} (${client.id}) banned from room ${room}`);
        } else {
            console.log(`Client ${userId} banned from room ${room}`);
        }
        this.server.to(room).emit('newConnectionOnChannel', {room, user});
    }

    async handleUnban(client: Socket, userId: number, roomId: string ) {
        const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
        if (client) {
            client.emit('NewChatRoom', { room });
            console.log(`Client ${userId} (${client.id}) unbanned from room ${room}`);
        } else {
            console.log(`Client ${userId} unbanned from room ${room}`);
        }
        this.server.to(room).emit('newDisconnectionOnChannel', {room, userId});
    }

    async handleAdminUpdate(client: Socket, userId: number, roomId: string ) {
        const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
        if (client) {
            console.log(`Client ${userId} (${client.id}) updated admin status in room ${room}`);
        } else {
            console.log(`Client ${userId} updated admin status in room ${room}`);
        }
        const user = await this.memberShipService.getMemberShipFromUserAndChannelId(userId, Number(roomId));
        this.server.to(room).emit('newConnectionOnChannel', {room, user});
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(client: Socket, roomId: string) {
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        const room = await this.chatroomService.getChannelNameFromId(Number(roomId));
        client.leave(room);
        client.emit('leftRoom', {room});
        console.log(`Client ${userId} (${client.id}) left room ${room}`);
        this.server.to(room).emit('newDisconnectionOnChannel', {room, userId});
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket
        ) : Promise<void> {
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        const {roomId, message} = body;
        const newMessage = await this.chatroomService.addMessageToChannel(roomId, userId, message);
        const room = await this.chatroomService.getChannelNameFromId(roomId);
        this.server.to(room).emit('new-message',
            {newMessage, room}
        );
    }

    // =========================================================================== //
    // ============================ GAME EVENTS ================================== //
    // =========================================================================== //
    @SubscribeMessage('joinQueue')
    async handleJoinGameRoom(player: Socket) {

        const userId = await this.chatroomService.getUserIdFromSocket(player);
        this.queued.push(userId);
        console.log(userId + " have joined queue!");
        console.log("queueList:", this.queued);
        if (this.queued.length >= 2) {
            const newGameRoom: GameRoomDto = {
                gameId: this.gameRooms.length,
                roomName: this.queued[0].userId + "_" + this.queued[1].userId,
                playerOneId: this.queued[0].userId,
                playerTwoId: this.queued[1].userId,
                data: this.setGameData(this.queued[0].userId, this.queued[1].userId),
            }
            this.leaveQueue(userId);
        }

        // console.log(`Client ${user.username} (${player.id}) joined room ${roomName}`);
        // this.server.to(roomName).emit('newGameConnection', 
        //     {roomName, newGame}
        // );
    }

    // @SubscribeMessage('leaveGameRoom')
    // async handleLeaveGameRoom(userSocket: Socket) {
        // const userId = await this.chatroomService.getUserIdFromSocket(userSocket);
        // this.gameRooms.forEach(game => {
            // if (game.playerOneId === userId || game.playerTwoId === userId) {
            //     this.gameRooms.splice()
            // }
        // })
    // }

    // HOW TO HANDLE PLAYER 1 , PLAYER 2 ??
    @SubscribeMessage('move')
    async handleMove(@MessageBody() body: any, @ConnectedSocket() socket) {
        const {move} = body;
        console.log(move);
    }

    @SubscribeMessage('stopMove')
    async handleStopMove(@MessageBody() body: any, @ConnectedSocket() socket) {
        const {stopMove} = body;
        console.log(stopMove);
    }
    
    @SubscribeMessage('leaveQueue')
    leaveQueue(userId: UserIdDto) {
        console.log(userId + " leaved queue!");
        console.log("queueList:", this.queued);
        const playerIndex = this.queued.indexOf(userId);
        this.queued.splice(playerIndex, 1);
    }

    setGameData(playerOneId: number, playerTwoId: number): GameDto{
        let player1: PlayerDto = {
			id: playerOneId,
			color: '#cba6f7aa',
    		x: 0.02,
    		y: 0.5,
    		w: 0.01,
    		h: 0.15,
    		velocity: 0,
    		angle: 60,
    		points: 0,
		}

		let player2: PlayerDto = {
			id: playerTwoId,
			color: '#cba6f7aa',
    		x: 0.98,
    		y: 0.5,
    		w: 0.01,
    		h: 0.15,
    		velocity: 0,
    		angle: 60,
    		points: 0,
		}

		let ball: BallDto = {
			color: '#cba6f7',
    		x: 0.5,
    		y: 0.5,
    		r: 0.01,
    		pi2: Math.PI * 2,
    		speed: [0, 0],
    		incr: 0,
		}

		let data: GameDto = {
			player1: player1,
			player2: player2,
			ball: ball,
		}

        return data;
    }

    // Send the players positions + ball positions to correct room
    async sendGameData(roomName: string, gameData: GameDto) {
        this.server.to(roomName).emit('updateGame', {gameData});
    }

    // Should emit to room event 'GameOver' ??







    /*
        if in the future we come back to the idea of centralizing socket.emit + adding user to channel in DB
        for now not considered the best choice in order to keep HTTP status response and separation of concerns
    */
    // @SubscribeMessage('joinRoom')
    // async joinRoom(@ConnectedSocket() client: Socket, room: string) {
    //     console.log("room name got when emit joinroom: ", room);
    //     const userId = await this.chatroomService.getUserIdFromSocket(client);
    //     const password = await this.chatroomService.getPasswordFromChannelName(room);
    //     const channelId = await this.chatroomService.getIdFromChannelName(room);

    //     try {
    //         const updateResult = await this.chatroomService.join(channelId, userId, password);
    //         client.join(room);
    //         console.log(`Client ${client.id} joined room ${room}`);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}
