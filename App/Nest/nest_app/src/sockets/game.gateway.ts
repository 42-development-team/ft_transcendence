import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
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
        // const userId = await this.userService.getUserIdFromSocket(client);
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
        if (player2SocketId) {
            const player2Socket: Socket = await this.clients.find(c => c.id == player2SocketId);
            await player2Socket?.join(newGameRoom.roomName);
        }
        this.server.to(newGameRoom.roomName).emit('matchIsReady', newGameRoom.data);
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(userId: UserIdDto) {
        this.gameService.handleLeaveQueue(userId);
    }

    // HOW TO HANDLE PLAYER 1 , PLAYER 2 ??
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

        let data: GameDto = await this.gameService.handleLaunchGame(id, userId);
        if (data) {
           this.gameLogic(data);
        }
    }

    async gameLogic(data: GameDto) {
        while (data.end === false) {
            // var startTime = performance.now();
            data = await this.gameService.calculateGame(data.id); // ATTENTION A LA DUREE DU SLEEP
            this.sendDataToRoom(data);
            // var endTime = performance.now();
            await this.gameService.sleep(1000 / 60);
            // await this.gameService.sleep((1000 / 30) - (endTime - startTime));
        }
        await this.gameService.createGame(data);
        this.gameService.removeRoom(data.roomName);
    }

    async sendDataToRoom(data: GameDto) {
        this.server.to(data.roomName).emit('updateGame', data);
    }
}
