import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { UserIdDto } from 'src/userstats/dto/user-id.dto';

type queueReturn = [GameRoomDto, string];

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
    // gameRooms: GameRoomDto[] = [];
    // queued: UserIdDto[] = [];

	async handleConnection(client: Socket) {
		const userId = await this.userService.getUserIdFromSocket(client);
		if (userId) {
			console.log('Client connected in game: ' + client.id);
			this.clients.push(client);
			// todo: Check for verifiedJWT in socket and disconnect if not OK
			// and retrieve all the channels the user is a member of
		} else {
			console.log('User not authenticated');
			client.disconnect();
		}
	}

    async handleDisconnect(client: Socket){
		console.log('Client disconnected from game: ' + client.id);
        const userId = await this.userService.getUserIdFromSocket(client);
        this.clients = this.clients.filter(c => c.id !== client.id);
    }

    // =========================================================================== //
    // ============================ GAME EVENTS ================================== //
    // =========================================================================== //
    @SubscribeMessage('joinQueue')
    async handleJoinQueue(player: Socket) {
        const result: queueReturn = await this.gameService.handleJoinQueue(player);

        if (!result[0])
            return ;
        else if (!result[1])
            this.server.to(result[0].roomName).emit('matchIsReady', result[0].data);
        else {
            const player2Socket: Socket = await this.clients.find(c => c.id == result[1]);
		    await player2Socket?.join(result[0].roomName);

            // send game data to players
            this.server.to(result[0].roomName).emit('matchIsReady', result[0].data);
        }

    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(userId: UserIdDto) {
        this.gameService.handleLeaveQueue(userId);
    }

    // HOW TO HANDLE PLAYER 1 , PLAYER 2 ??
    @SubscribeMessage('move')
    async handleMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        // console.log("userId", userId);
        this.gameService.handleMove(event, id, userId);
    }

    @SubscribeMessage('stopMove')
    async handleStopMove(socket: Socket, @MessageBody() body: any) {
        const [event, id, userId] = body;
        this.gameService.handleStopMove(event, id, userId);
    }

    @SubscribeMessage('launchGame')
    async handleLaunchGame(socket: Socket, id: number) {
        this.gameService.handleLaunchGame(this.server, id);
        // while (!data.end) {
        //     let data = await this.getDataFromRoomId(id);
        //     if (!data)
        //         return ;
        //     data = await this.gameService.calculateGame(data);
        //     this.sendDataToRoom(data);
        //     await this.sleep(1000/60);
        // }
    }

    // handle refresh as disconectied or not ??

    async sendDataToRoom(data: GameDto) {
        this.server.to(data.roomName).emit('updateGame', data);
    }

    // Should emit to room event 'GameOver' ??
}
