import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ChatroomService } from '../chatroom/chatroom.service';
import { UsersService } from '../users/users.service'
import { MembershipService } from 'src/membership/membership.service';
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { UserIdDto } from 'src/userstats/dto/user-id.dto';

@Injectable()
@WebSocketGateway({cors:{
    credentials: true,
}})

export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private chatroomService: ChatroomService,
        private gameService: GameService,
        private userService: UsersService,
        private memberShipService: MembershipService,
    ) {
            console.log("SocketGateway Constructor");
    }


    @WebSocketServer()
    server: Server;

    clients: Socket[] = [];
    gameRooms: GameRoomDto[] = [];
    queued: UserIdDto[] = [];

     // The client object is an instance of the Socket class provided by the Socket.io library.
     // handleConnection is a method predefined on OnGatewayConnection. We can't change the name
     // why "(client: Socket)" ? because client is an instance of Socket class
	async handleConnection(client: Socket) {
		const userId = await this.chatroomService.getUserIdFromSocket(client);
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

    // handleDisconnect is a predefined method of the OnGatewayDisconnect interface
    async handleDisconnect(client: Socket){
		console.log('Client disconnected: ' + client.id);
        const userId = await this.chatroomService.getUserIdFromSocket(client);
        await this.userService.updateSocketId(userId, null);
        this.clients = this.clients.filter(c => c.id !== client.id);
		const userStatus = await this.userService.getCurrentStatusFromId(userId);
		this.server.emit("userLoggedOut", { userId });
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
    async handleJoinQueue(player: Socket) {

        try {
            const userId = await this.chatroomService.getUserIdFromSocket(player);
            this.queued.push({userId});
            
            if (this.queued.length >= 2) {
                const player2Id: number = this.queued[0].userId;
                const player1Id: number = this.queued[1].userId;

                // create room data
                const id: number = this.gameRooms.length;
                const roomName: string = player1Id + "_" + player2Id;
                const newGameRoom: GameRoomDto = {
                    id: id,
                    roomName: roomName,
                    playerOneId: player1Id,
                    playerTwoId: player2Id,
                    data: this.gameService.setGameData(id, roomName, player1Id, player2Id),
                }

                // add room to rooms list
                this.gameRooms.push(newGameRoom);
                // pop player from queue list
                this.handleLeaveQueue(this.queued[0]);
                this.handleLeaveQueue(this.queued[1]);

                // Create room instance and join room
                await player?.join(roomName);

                const player2SocketId: string = await this.userService.getUserSocketFromId(player2Id);
                const player2Socket: Socket = await this.clients.find(c => c.id == player2SocketId);
			    await player2Socket?.join(roomName);

                // send game data to players
                this.server.to(roomName).emit('matchIsReady', newGameRoom.data);
            }
        } catch (e) {
            console.log(e);
        }
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(userId: UserIdDto) {
        const playerIndex = this.queued.indexOf(userId);
        this.queued.splice(playerIndex, 1);
    }
    
    // HOW TO HANDLE PLAYER 1 , PLAYER 2 ??
    @SubscribeMessage('move')
    async handleMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        // console.log("userId", userId);
        let data: GameDto = this.gameRooms.find(game => game.id === id)?.data;
        if (!data) {
            console.log("!Data")
            return ;
        }
        if (data.player1.id === userId) {
            if (event === "ArrowUp")
                this.gameService.setVelocity(-0.01, data.player1);
            else if (event === "ArrowDown")
                this.gameService.setVelocity(0.01, data.player1);
        }
        else {
            if (event === "ArrowUp")
                this.gameService.setVelocity(-0.01, data.player2);
            else if (event === "ArrowDown")
                this.gameService.setVelocity(0.01, data.player2);
        }
    }
    
    @SubscribeMessage('stopMove')
    async handleStopMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        let data: GameDto = this.gameRooms.find(game => game.id === id)?.data;
        if (!data)
            return ;
        if (data.player1.id === userId) {
            if (event === "ArrowUp")
                this.gameService.killVelocity(data.player1);
            else if (event === "ArrowDown")
                this.gameService.killVelocity(data.player1);
        }
        else {
            if (event === "ArrowUp")
            this.gameService.killVelocity(data.player2);
        else if (event === "ArrowDown")
            this.gameService.killVelocity(data.player2);
        }
    }

    @SubscribeMessage('launchGame')
    async handleLaunchGame(socket: Socket, id: number) {
        let data: GameDto = await this.getDataFromRoomId(id);
        if (!data) {
            console.log("!LaunchGame Data")
            return ;
        }
        while (data.player1.points < 5 && data.player2.points < 5) {
            let data = await this.getDataFromRoomId(id);
            if (!data)
                return ;
            data = await this.gameService.calculateGame(data);
            this.sendDataToRoom(data);
            await this.sleep(1000/60);
        }

        // handle finish game
    }

    // handle disconnect during game
    // handle refresh

    async sendDataToRoom(data: GameDto) {
        this.server.to(data.roomName).emit('updateGame', data);
    }

    async getDataFromRoomId(id: number): Promise<GameDto> {
        return this.gameRooms.find(game => game.id === id)?.data;
    }

    async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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
