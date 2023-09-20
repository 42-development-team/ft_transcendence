import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { InviteDto } from 'src/game/dto/invite-game.dto';

@Injectable()
@WebSocketGateway({cors:{
    credentials: true,
}})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(
        private gameService: GameService,
        private userService: UsersService,
    ) {}

    @WebSocketServer()
    server: Server;

    clients: Socket[] = [];

	async handleConnection(client: Socket) {
		const userId = await this.userService.getUserIdFromSocket(client);
		if (userId) {
			this.clients.push(client);
		} else {
			console.log('User not authenticated');
			client.disconnect();
		}
	}

    async handleDisconnect(client: Socket){
        this.clients = this.clients.filter(c => c.id !== client.id);
    }

    // =========================================================================== //
    // ============================ GAME EVENTS ================================== //
    // =========================================================================== //
    @SubscribeMessage('invite')
    async handleInvite(invitorSocket: Socket, @MessageBody() body: any) {
        const invitorId: number = await this.userService.getUserIdFromSocket(invitorSocket);

        // body awaits for the invited id (type number) and the mode game (boolean)
        const {invitedId, mode} = body;
        
        if (invitorId !== invitedId)
            this.gameService.handleInvite(invitorId, invitedId, mode);
        const invitedSocket: any = this.userService.getUserSocketFromId(invitedId);
        invitedSocket?.emit('receiveInvite', invitorId, mode);
        invitorSocket?.emit('inviteSent');
    } //TODO: handle cancel invite + handle multi invite ( multiple user invite the same )

    @SubscribeMessage('respondToInvite')
    async handleRespondToInvite(invitedSocket: Socket, @MessageBody() body: any) {
        const invitedId: number = await this.userService.getUserIdFromSocket(invitedSocket);

        // body awaits for the invitor id (type number) and accept (boolean)
        const { invitorId, accept } = body;
        const inviteInfos: InviteDto = await this.gameService.handleRespondToInvite(invitorId, invitedId, accept);
        if (inviteInfos !== undefined)  {
            const gameRoom: GameRoomDto = await this.gameService.setGameRoom(inviteInfos.invitorId, inviteInfos.invitedId, inviteInfos.mode);
            const invitorSocketId: string = await this.userService.getUserSocketFromId(invitorId);
            const invitedSocketId: string = await this.userService.getUserSocketFromId(invitedId);
            this.joinGameRoom(invitorSocketId, invitedSocketId, gameRoom);
        }
    }

    
    @SubscribeMessage('joinQueue')
    async handleJoinQueue(player: Socket, mode: boolean) {
        const userId: number = await this.userService.getUserIdFromSocket(player);
        const result = await this.gameService.handleJoinQueue(userId, mode);

        // queue not full
        if (!result)
            return ;
        
        // queue is full => game is created
        const {newGameRoom, player1SocketId, player2SocketId} = result;
        if (player1SocketId && player2SocketId ) {
            //game is created from scratch
            this.joinGameRoom(player1SocketId, player2SocketId, newGameRoom);
        }
        else {
            // game already exist and player have to join it
            player?.join(newGameRoom.roomName);
            this.server.to(newGameRoom.roomName).emit('reconnectGame', newGameRoom.data);
        }
    }

    async joinGameRoom(player1SocketId: string, player2SocketId: string, room: GameRoomDto) {
        const player1Socket: Socket = this.clients.find(c => c.id == player1SocketId);
        const player2Socket: Socket = this.clients.find(c => c.id == player2SocketId);
        await player1Socket?.join(room.roomName);
        await player2Socket?.join(room.roomName);
        this.server.to(room.roomName).emit('redirect', 'redirectToHomeForGame');
        this.server.to(room.roomName).emit('matchIsReady', room.data);
    }

    @SubscribeMessage('isInGame')
    async isAlreadyInGame(socket: Socket, userId: number) {
        const data = await this.gameService.getDataFromUserId(userId);
        const isAlreadyInGame = data ? true : false;
        if (isAlreadyInGame) {
            socket.emit('isAlreadyInGame', data);
        }
        return ;
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(socket: Socket, userId: number) {
        this.gameService.handleLeaveQueue(userId);
    }

    @SubscribeMessage('isUserQueued')
    async isUserQueued(socket: Socket, userId: number) {
        const isQueued = await this.gameService.getIsQueued(userId);
        if (isQueued)
            socket.emit('isQueued');
        else
            socket.emit('isNotQueued');
    }

    @SubscribeMessage('move')
    async handleMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        this.gameService.handleMove(event, id, userId);
    }

    @SubscribeMessage('stopMove')
    async handleStopMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        this.gameService.handleStopMove(event, id, userId);
    }

    @SubscribeMessage('launchGame')
    async handleLaunchGame(socket: Socket, id: number) {
        const userId: number = await this.userService.getUserIdFromSocket(socket);

        let room: GameRoomDto = await this.gameService.handleLaunchGame(id, userId);
        this.gameService.handleLeaveQueue(userId);
        if (room && room.data) {
            if (room.reconnect === false) {
                room.reconnect = true;
                this.gameLogic(room.data);
            }
        }
    }

    @SubscribeMessage('retrieveData')
    async handleRetrieveData(socket: Socket, userId: number) {
        const data = await this.gameService.getDataFromUserId(userId);
        if (data === undefined || !data)
            console.log("Error retrieving Game Data: data is null");
        socket?.emit('sendDataToUser', data);
        socket?.join(data.roomName);
    }

    @SubscribeMessage('surrender')
    async handleSurrender(socket: Socket, @MessageBody() body: any) {
        const [id, userId] = body;
        this.gameService.surrender(id, userId);
    }

    // ============================== //
    // ========= GAME LOGIC =========//

    async sleepAndCalculate(data: GameDto): Promise<GameDto> {
        const promiseSleep = this.gameService.sleep(1000 / 60);
        const promiseCalculate = this.gameService.calculateGame(data.id, data.mode);
    
        await Promise.all([promiseSleep, promiseCalculate]);
        return promiseCalculate;
    }

    async gameLogic(data: GameDto) {
        while (data.end === false) {
            await this.sleepAndCalculate(data);
            await this.sendDataToRoom(data);
        }
        const results = await this.gameService.createGame(data);
        console.log('results: ', results);
        this.server.to(data.roomName).emit('endOfGame', {winnerId: results.gameWonId, loserId: results.gameLosedId});
        await this.gameService.removeRoom(data.id);
    }

    async sendDataToRoom(data: GameDto) {
        this.server.to(data.roomName).emit('updateGame', data);
    }
}
