import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { InviteDto } from 'src/game/dto/invite-game.dto';
import { CreateUserDto } from 'src/users/dto';

@Injectable()
@WebSocketGateway({
    cors: {
        credentials: true,
    }
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
            console.log("GameSocket Connected: ", client.id);
            this.clients.push(client);
        } else {
            console.log('User not authenticated');
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
		const userId = await this.userService.getUserIdFromSocket(client);
        const updateUser = await this.userService.removeSocketId(userId, client.id);
        if (updateUser && updateUser.socketIds.length === 0) {
			await this.userService.updateStatus(userId, "offline");
            await this.cleanQueues(client);
            this.gameService.handleLeaveQueue(userId);
		}
        console.log("GameSocket Disconnected: ", client.id);
        this.clients = this.clients.filter(c => c.id !== client.id);
    }

    async cleanQueues(client: Socket) {
        const userId = await this.userService.getUserIdFromSocket(client);
        const inviteQueue = this.gameService.inviteQueue.find(i => i.invitedId === userId || i.invitorId === userId);
        if (inviteQueue) {
            const { invitorId, invitedId } = inviteQueue;
            const invitorIdNumber = Number(invitorId);
            const invitedIdNumber = Number(invitedId);
            if (invitorId === userId) {
                const invitedSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitedIdNumber);
                invitedSocketIds.forEach(async invitedSocketId => {
                    const invitedSocket: Socket = this.clients.find(c => c.id == invitedSocketId);
                    invitedSocket?.emit('inviteCanceled', { invitorId });
                });
            }
            else if (invitedId === userId) {
                const invitorSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitorIdNumber);
                invitorSocketIds.forEach(async invitorSocketId => {
                    const invitorSocket: Socket = this.clients.find(c => c.id == invitorSocketId);
                    invitorSocket?.emit('inviteDeclined', { invitorId });
                });
            }
           await this.gameService.handleRemoveInviteQueue(inviteQueue);
        }
    }
        
    // =========================================================================== //
    // ============================ GAME EVENTS ================================== //
    // =========================================================================== //
    @SubscribeMessage('invite')
    async handleInvite(@ConnectedSocket() invitorSocket: Socket, @MessageBody() body: any) {
        try {
            const invitorId: number = await this.userService.getUserIdFromSocket(invitorSocket);
            if (invitorId === undefined)
                return;
            const { invitedId, modeEnabled }: { invitedId: number, modeEnabled: boolean } = await body;

            const invitedIdNumber = Number(invitedId);
            const invitorUser: CreateUserDto = await this.userService.getUserFromId(invitorId);
            const invitedUser: CreateUserDto = await this.userService.getUserFromId(invitedIdNumber);
            const invitedSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitedIdNumber);
            const invitorSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitorId);
            
            const invitorUsername: string = invitorUser.username;
            const invitedUsername: string = invitedUser.username;

            invitedSocketIds.forEach(async invitedSocketId => {
                const invitedSocket: Socket = this.clients.find(c => c.id === invitedSocketId);
                if (invitorId !== invitedId) {
                    if (await this.gameService.isInGame(invitorId) || await this.gameService.getIsQueued(invitorId)) { // invitor is in game - matchmaking queue
                        console.log("error: invitor is in a game")
                        invitorSocket?.emit('isAlreadyInGame', { invitedUsername });
                        return ;
                    }
                    if (await this.gameService.isInGame(invitedId) || await this.gameService.getIsQueued(invitedIdNumber)) { // invited is in game - matchmaking queue
                        console.log("error: invited is in a game")
                        invitorSocket?.emit('isAlreadyInGame', { invitedUsername });
                        return ;
                    }
                    if (await this.gameService.queueAlreadyExists(invitorId, invitedId) === true) { // this exact queue alrady exist
                        console.log("error: this exact queue already exist");
                        return ;
                    }

                    const idToNotify: number = await this.gameService.invitorIsInvited(invitorId); // invitor is invited by someone else
                    if (idToNotify >= 0) {
                        const ids = await this.userService.getSocketIdsFromUserId(idToNotify); //

                        ids.forEach(id => {
                            const invitorSocketToNotify = this.clients.find(c => c.id === id);
                            invitorSocketToNotify?.emit('inviteDeclined');
                        });
                    }
                    await this.gameService.addInviteQueue(invitorId, invitedIdNumber, modeEnabled);
                    invitedSocket?.emit('receiveInvite', { invitorId, invitorUsername, modeEnabled });
                    if (invitedSocketId === invitedSocketIds[0]) {
                        invitorSocketIds.forEach(async invitorSocketId => {
                            const invitorSocket: Socket = this.clients.find(c => c.id == invitorSocketId);
                            invitorSocket?.emit('inviteSent', { invitedUsername });
                        });
                    }
                    
                }
            });

        } catch (error) {
            console.log("error: ", error);
        }
    }

    @SubscribeMessage('respondToInvite')
    async handleRespondToInvite(@ConnectedSocket() invitedSocket: Socket, @MessageBody() body: any) {

        const invitedId: number = await this.userService.getUserIdFromSocket(invitedSocket);
        const { invitorId, response } = body;

        const invitorIdNumber = Number(invitorId);
        const invitorSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitorIdNumber);

        invitorSocketIds.forEach(async invitorSocketId => {
            const invitorSocket: Socket = this.clients.find(c => c.id == invitorSocketId);
            const inviteInfos: InviteDto = await this.gameService.handleRespondToInvite(invitorIdNumber, invitedId, response);
            if (!response)
                invitorSocket?.emit('inviteDeclined');
            else if (inviteInfos !== undefined) {
                invitorSocket?.emit('inviteAccepted');

                const gameRoom: GameRoomDto = await this.gameService.setGameRoom(inviteInfos.invitorId, inviteInfos.invitedId, inviteInfos.mode);
                const invitedSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitedId);
                const inviteQueue: InviteDto = await this.gameService.getInviteQueue(invitedId, invitorIdNumber);
                await this.joinGameRoom(invitorSocketIds, invitedSocketIds, gameRoom);
                await this.gameService.handleRemoveInviteQueue(inviteQueue);
            }
        });
    }

    @SubscribeMessage('cancelInvite')
    async handleCancelInvite(@ConnectedSocket() invitorSocket: Socket, @MessageBody() body: any) {
        const invitorId: number = await this.userService.getUserIdFromSocket(invitorSocket);
        const { invitedId }: { invitedId: number } = body;
        const invitedIdNumber = Number(invitedId);
        const invitorIdNumber = Number(invitorId);
        const inviteQueue: InviteDto = await this.gameService.getInviteQueue(invitedIdNumber, invitorIdNumber);
        console.log("invitorId: ", invitorId, "invitedId: ", invitedId, "inviteQueue: ", inviteQueue) ;
        if (invitorIdNumber !== invitedIdNumber)
            await this.gameService.handleRemoveInviteQueue(inviteQueue);
        const invitorSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitorIdNumber);
        const invitedSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitedIdNumber);
        invitedSocketIds.forEach(async invitedSocketId => {
            const invitedSocket: Socket = this.clients.find(c => c.id == invitedSocketId);
            invitedSocket?.emit('inviteCanceled', { invitorId });
        });
        invitorSocketIds.forEach(async invitorSocketId => {
            const invitorSocket: Socket = this.clients.find(c => c.id == invitorSocketId);
            invitorSocket?.emit('closePanel');
        }
        );
    }

    @SubscribeMessage('removeInviteQueue')
    async handleRemoveInviteQueue(@ConnectedSocket() invitedSocket: Socket, @MessageBody() body: any) {
        const invitedId: number = await this.userService.getUserIdFromSocket(invitedSocket);
        const { invitorId }: { invitorId: number } = body;
        const inviteQueue: InviteDto = await this.gameService.getInviteQueue(invitedId, invitorId);
        await this.gameService.handleRemoveInviteQueue(inviteQueue);
    }

    @SubscribeMessage('joinQueue')
    async handleJoinQueue(player: Socket, mode: boolean) {
        const userId: number = await this.userService.getUserIdFromSocket(player);
        const result = await this.gameService.handleJoinQueue(userId, mode);

        // queue not full
        if (!result)
            return;

        // queue is full => game is created
        const { newGameRoom, player1SocketIds, player2SocketIds } = result;
        if (player1SocketIds && player2SocketIds && player1SocketIds.length > 0 && player2SocketIds.length > 0) {
            //game is created from scratch
            this.joinGameRoom(player1SocketIds, player2SocketIds, newGameRoom);
        }
        else {
            // game already exist and player have to join it
            player?.join(newGameRoom.roomName);
            this.server.to(newGameRoom.roomName).emit('reconnectGame', newGameRoom.data);
        }
    }

    async joinGameRoom(player1SocketIds: string[], player2SocketIds: string[], room: GameRoomDto) {
        player1SocketIds.forEach(async player1SocketId => {
            const player1Socket: Socket = this.clients.find(c => c.id == player1SocketId);
            await player1Socket?.join(room.roomName);
        });
        player2SocketIds.forEach(async player2SocketId => {
            const player2Socket: Socket = this.clients.find(c => c.id == player2SocketId);
            await player2Socket?.join(room.roomName);
        });
        this.server.to(room.roomName).emit('redirect', 'redirectToHomeForGame');
        this.server.to(room.roomName).emit('matchIsReady', room.data);
    }

    @SubscribeMessage('isInGame')
    async isAlreadyInGame(socket: Socket, userId: number) {
        const data = await this.gameService.getDataFromUserId(userId);
        const socketOwnerId = await this.userService.getUserIdFromSocket(socket);
        const sidePanelPopUp = socketOwnerId !== userId ? true : false;
        const isAlreadyInGame = data ? true : false;
        if (isAlreadyInGame) {
            socket.emit('isAlreadyInGame', {data, sidePanelPopUp});
        }
        return;
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
        await this.userService.updateStatus(userId, "in a game");
        this.server.emit("userStatusUpdate", { userId });
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
    async handleSurrender(@MessageBody() body: any) {
        const [id, userId] = body;
        this.gameService.surrender(id, userId);
        await this.userService.updateStatus(userId, "online");
        this.server.emit("userStatusUpdate", { userId });
    }

    // ============================== //
    // ========= GAME LOGIC =========//

    async sleepAndCalculate(game: GameRoomDto): Promise<GameDto> {
        const promiseSleep = this.gameService.sleep(1000/60);
        const promiseCalculate = this.gameService.calculateGame(game);

        await Promise.all([promiseSleep, promiseCalculate]);
        return promiseCalculate;
    }

    async gameLogic(data: GameDto) {
        const game: GameRoomDto = await this.gameService.getGameFromId(data.id);
        while (game.data.end === false) {
            await this.sleepAndCalculate(game);
            await this.sendDataToRoom(game);
        }
        const results = await this.gameService.createGame(data);
        console.log('results: ', results);
        this.server.to(data.roomName).emit('endOfGame', { winnerId: results.gameWonId, loserId: results.gameLosedId });
        await this.gameService.removeRoom(data.id);
        await this.userService.updateStatus(results.gameLosedId, "online");
        await this.userService.updateStatus(results.gameWonId, "online");
        this.server.emit("userStatusUpdate", { userId: results.gameLosedId });
        this.server.emit("userStatusUpdate", { userId: results.gameWonId });
    }

    async sendDataToRoom(game: GameRoomDto) {
        this.server.to(game.data.roomName).emit('updateGame', game.data);
    }
}
