import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, Redirect } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { UserIdDto } from 'src/userstats/dto/user-id.dto';

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
			console.log('Client connected in game: ' + client.id);
			this.clients.push(client);
		} else {
			console.log('User not authenticated');
			client.disconnect();
		}
	}

    async handleDisconnect(client: Socket){
		console.log('Client disconnected from game: ' + client.id);
        this.clients = this.clients.filter(c => c.id !== client.id);
    }

    // =========================================================================== //
    // ============================ GAME EVENTS ================================== //
    // =========================================================================== //
    @SubscribeMessage('joinQueue')
    async handleJoinQueue(player: Socket) {
        const result = await this.gameService.handleJoinQueue(player);

        if (!result)
            return ;
        
        const {newGameRoom, player2SocketId} = result;
        if (player2SocketId ) {
            const player2Socket: Socket = this.clients.find(c => c.id == player2SocketId);
            await player2Socket?.join(newGameRoom.roomName);
            // this.server.to(newGameRoom.roomName).emit('redirect', 'redirectToHomeForGame');
            console.log('data: ', newGameRoom.data);
            this.server.to(newGameRoom.roomName).emit('matchIsReady', newGameRoom.data);
        }
        else {
            newGameRoom.reconnect = true;
            this.server.to(newGameRoom.roomName).emit('reconnectGame', newGameRoom.data);
        }
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(userId: UserIdDto) {
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
        console.log('game.gateway - New Game Starts');
        const userId: number = await this.userService.getUserIdFromSocket(socket);

        let room: GameRoomDto = await this.gameService.handleLaunchGame(id, userId);
        console.log('launchGame before gamelogic')
        if (room && room.data) {
            console.log('launchGame in gamelogic')
            if (room.reconnect === false)
                room.reconnect = true;
                this.gameLogic(room.data);
        }
    }

    @SubscribeMessage('retrieveData')
    async handleRetrieveData(socket: Socket, userId: number) {
        const data = await this.gameService.getDataFromUserId(userId);
        socket?.emit('sendDataToUser', data);
    }

    @SubscribeMessage('surrender')
    async handleSurrender(socket: Socket, {id, userId}: {id: number, userId: number}) {
        this.gameService.surrender(id, userId);
    }

    async sleepAndCalculate(data: GameDto): Promise<GameDto> {
        const promiseSleep = this.gameService.sleep(1000 / 60);
        const promiseCalculate = this.gameService.calculateGame(data.id);
    
        await Promise.all([promiseSleep, promiseCalculate]);
        return promiseCalculate;
    }

    async gameLogic(data: GameDto) {
        while (data.end === false) {
            await this.sleepAndCalculate(data);
            this.sendDataToRoom(data);
        }
        const results = await this.gameService.createGame(data);
        const winnerId: number = results.gameWonId;
        const loserId: number = results.gameLosedId;
        this.server.to(data.roomName).emit('endOfGame', {winnerId, loserId});
        this.gameService.removeRoom(data.id);
    }

    async sendDataToRoom(data: GameDto) {
        this.server.to(data.roomName).emit('updateGame', data);
    }
}
