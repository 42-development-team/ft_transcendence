import { WebSocketServer, WebSocketGateway, ConnectedSocket, MessageBody, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { GameService } from 'src/game/game.service';
import { GameDto } from 'src/game/dto/game-data.dto';
import { GameRoomDto } from 'src/game/dto/create-room.dto';
import { InviteDto } from 'src/game/dto/invite-game.dto';
import { CreateUserDto } from 'src/users/dto';
import { delay } from 'rxjs';

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
    ) { }

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
            const game: GameRoomDto = await this.gameService.getGameFromUserId(userId);
            if (game !== undefined) {
                userId === game.playerOneId ? game.playerOneDisconnected = false : game.playerTwoDisconnected = false;
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = await this.userService.getUserIdFromSocket(client);
        const updateUser = await this.userService.removeSocketId(userId, client.id);
        await this.cleanQueues(client);
        if (updateUser && updateUser.socketIds.length === 0) {
            const game: GameRoomDto = await this.gameService.getGameFromUserId(userId);
            if (game !== undefined) {
                userId === game.playerOneId ? game.playerOneDisconnected = true : game.playerTwoDisconnected = true;
            }
            await this.userService.updateStatus(userId, "offline");
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
                await this.emitToUser(invitedIdNumber, 'inviteCanceled', { invitorId });
            }
            else if (invitedId === userId) {
                await this.emitToUser(invitorIdNumber, 'inviteDeclined', { invitedId });
            }
            await this.emitToUser(invitorIdNumber, 'closePanel', { invitorId });
            await this.emitToUser(invitedIdNumber, 'closePanel', { invitorId });
            await this.gameService.handleRemoveInviteQueue(inviteQueue);
        }
    }

    async emitToUser(userId: number, event: string, data: any) {
        const socketIds: string[] = await this.userService.getSocketIdsFromUserId(userId);
        socketIds.forEach(async socketId => {
            const socket: Socket = this.clients.find(c => c.id == socketId);
            socket?.emit(event, data);
        });
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
            const invitorIdNumber = Number(invitorId);
            const invitorUser: CreateUserDto = await this.userService.getUserFromId(invitorId);
            const invitedUser: CreateUserDto = await this.userService.getUserFromId(invitedIdNumber);
            const invitorUsername: string = invitorUser.username;
            const invitedUsername: string = invitedUser.username;

            if (invitorId !== invitedId) {
                if (await this.gameService.isInGame(invitorIdNumber) || await this.gameService.getIsQueued(invitorIdNumber)) { // invitor is in game - matchmaking queue
                    console.log("error: invitor is in a game")
                    await this.emitToUser(invitorIdNumber, 'isAlreadyInGame', { invitedUsername: invitedUsername, sidePanelPopUp: false });
                    return;
                }
                if (await this.gameService.isInGame(invitedIdNumber) || await this.gameService.getIsQueued(invitedIdNumber)) { // invited is in game - matchmaking queue
                    console.log("error: invited is in a game")
                    await this.emitToUser(invitorIdNumber, 'isAlreadyInGame', { invitedUsername: invitedUsername, sidePanelPopUp: true });
                    return;
                }
                if (await this.gameService.queueAlreadyExists(invitorId, invitedId) === true) { // this exact queue alrady exist
                    console.log("error: this exact queue already exist");
                    return;
                }

                const idToNotify: number = await this.gameService.invitorIsInvited(invitorId); // invitor is invited by someone else
                if (idToNotify >= 0) {
                    await this.emitToUser(idToNotify, 'inviteDeclined', null);
                }
                await this.gameService.addInviteQueue(invitorIdNumber, invitedIdNumber, modeEnabled);
                await this.emitToUser(invitedIdNumber, 'receiveInvite', { invitorId, invitorUsername, modeEnabled });
                await this.emitToUser(invitorId, 'inviteSent', { invitedUsername, invitedIdNumber });
            }
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
        const invitedSocketIds: string[] = await this.userService.getSocketIdsFromUserId(invitedId);
        const inviteInfos: InviteDto = await this.gameService.handleRespondToInvite(invitorIdNumber, invitedId, response);

        if (!response) {
            await this.emitToUser(invitorIdNumber, 'inviteDeclined', { invitedId });
            await this.emitToUser(invitedId, 'closePanel', { invitorId });
        }
        else if (inviteInfos !== undefined) {
            await this.emitToUser(invitorIdNumber, 'inviteAccepted', { invitedId });
            await this.emitToUser(invitedId, 'closePanel', { invitorId });
            const gameRoom: GameRoomDto = await this.gameService.setGameRoom(inviteInfos.invitorId, inviteInfos.invitedId, inviteInfos.mode);
            const inviteQueue: InviteDto = await this.gameService.getInviteQueue(invitedId, invitorIdNumber);
            await this.joinGameRoom(invitorSocketIds, invitedSocketIds, gameRoom);
            await this.gameService.handleRemoveInviteQueue(inviteQueue);
        }
    }

    @SubscribeMessage('cancelInvite')
    async handleCancelInvite(@ConnectedSocket() invitorSocket: Socket, @MessageBody() body: any) {
        const invitorId: number = await this.userService.getUserIdFromSocket(invitorSocket);
        const { invitedId }: { invitedId: number } = body;
        const invitedIdNumber = Number(invitedId);
        const invitorIdNumber = Number(invitorId);
        const inviteQueue: InviteDto = await this.gameService.getInviteQueue(invitedIdNumber, invitorIdNumber);

        if (invitorIdNumber !== invitedIdNumber)
            await this.gameService.handleRemoveInviteQueue(inviteQueue);
        await this.emitToUser(invitedIdNumber, 'inviteCanceled', { invitorId });
        await this.emitToUser(invitorIdNumber, 'closePanel', { invitedId });
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
        const id: number = await this.userService.getUserIdFromSocket(player);
        const inviteQueue: InviteDto = this.gameService.inviteQueue.find(i => i.invitedId === id || i.invitorId === id);
        const isQueued = inviteQueue !== undefined;
        await this.emitToUser(id, 'alreadyInInviteQueue', {isQueued: isQueued})
        if (inviteQueue !== undefined) {
            return;
        }
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
        const isAlreadyInGame = data !== undefined ? true : false;
        if (isAlreadyInGame) {
            socket.emit('isAlreadyInGame', { data, sidePanelPopUp });
        }
        return;
    }

    @SubscribeMessage('leaveQueue')
    handleLeaveQueue(socket: Socket, userId: number) {
        this.gameService.handleLeaveQueue(userId);
    }

    @SubscribeMessage('isUserQueued') //in matchmaking queue
    async isUserQueued(socket: Socket, userId: number) {
        const isQueued = await this.gameService.getIsQueued(userId);
        if (isQueued)
            socket?.emit('isQueued');
        else
            socket?.emit('isNotQueued');
    }

    @SubscribeMessage('isUserQueuedInvite') //in invite queue
    async isUserQueuedInvite(socket: Socket, userId: number) {
        const isQueued = this.gameService.inviteQueue.find(i => i.invitedId === userId || i.invitorId === userId);
        if (isQueued !== undefined)
            socket?.emit('isQueuedInvite', { isQueued: true });
        else
            socket?.emit('isQueuedInvite', { isQueued: false });
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
    async handleLaunchGame(socket: Socket) {
        const userId: number = await this.userService.getUserIdFromSocket(socket);
        const game: GameDto = await this.gameService.getDataFromUserId(userId);
        let room: GameRoomDto = await this.gameService.handleLaunchGame(game.id, userId);
        //=====================//
        //=====================//
        this.gameService.handleLeaveQueue(userId);
        if (room && room.data) {
            console.log("p1 id:", room.data.player1.id);
            console.log("p2 id:", room.data.player2.id);
            if (room.reconnect === false) {
                room.reconnect = true;
                this.gameLogic(room);
            }
        }
        await this.userService.updateStatus(userId, "in a game");
        this.server.emit("userStatusUpdate", { userId });
    }

    @SubscribeMessage('retrieveData')
    async handleRetrieveData(socket: Socket, userId: number) {
        const data = await this.gameService.getDataFromUserId(userId);
        if (data === undefined || !data) {
            console.log("Error retrieving Game Data: data is null");
            return;
        }
        socket?.join(data.roomName);
        socket?.emit('sendDataToUser', data);
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

    frameTime: number = 1000 / 60;
    reconnectionTimer: number = 15;

    async sleepAndCalculate(game: GameRoomDto): Promise<{data: GameDto, goal: boolean}> {
        const promiseSleep = this.gameService.sleep(this.frameTime);
        const promiseCalculate = this.gameService.calculateGame(game);

        await Promise.all([promiseSleep, promiseCalculate]);
        return promiseCalculate;
    }

    async asyncDelay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async launchCountdown(data: GameDto) {
        for(let i = 0; i < 2; i++) {
            this.server.to(data.roomName).emit('countdown', {countdown: 2 - i});
            await this.asyncDelay(1000);
        }
    }

    async handleEndOfGame(gameRoom: GameRoomDto) {
        const results = await this.gameService.createGame(gameRoom.data);
        this.server.to(gameRoom.roomName).emit('endOfGame', { winnerId: results.gameWonId, loserId: results.gameLosedId });
        await this.gameService.removeRoom(gameRoom.id);
        await this.userService.updateStatus(results.gameLosedId, "online");
        await this.userService.updateStatus(results.gameWonId, "online");
        this.server.emit("userStatusUpdate", { userId: results.gameLosedId });
        this.server.emit("userStatusUpdate", { userId: results.gameWonId });
    }

    async gameLogic(game: GameRoomDto) {
        await this.launchCountdown(game.data);
        while (game.data.end === false) {
            if (game.playerOneDisconnected || game.playerTwoDisconnected) {
                for (let i = 0; i < this.reconnectionTimer; i++) {
                        this.server.to(game.data.roomName).emit('playerDisconnected', {beforeLeave: this.reconnectionTimer - i } )
                    await this.asyncDelay(1000);
                    if ( !game.playerOneDisconnected && !game.playerTwoDisconnected) {
                        this.server.to(game.data.roomName).emit('playerReconnected')
                        break;
                    }
                    else if ( game.data.end ) {
                        break;
                    }
                }
                if ( game.playerOneDisconnected || game.playerTwoDisconnected) {
                    game.playerOneDisconnected ? game.data.forfeiterId = game.playerOneId : game.data.forfeiterId = game.playerTwoId;
                    game.data.end = true;
                }
            }
            else {
                let {data, goal} = await this.sleepAndCalculate(game);
                this.sendDataToRoom(game);
                if (goal === true && data.end === false) {
                    goal = false;
                    await this.launchCountdown(data);
                }
            }
        }
        this.handleEndOfGame(game);
    }

    async sendDataToRoom(game: GameRoomDto) {
        this.server.to(game.data.roomName).emit('updateGame', game.data);
    }
}
