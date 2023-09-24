import { PrismaService } from "src/prisma/prisma.service";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { BallDto, GameDto, PlayerDto } from "./dto/game-data.dto";
import { GameUserDto } from "./dto/game-user.dto";
import { GetGameDto } from "./dto/get-game.dto";
import { GameRoomDto } from "./dto/create-room.dto";
import { UsersService } from "src/users/users.service";
import { UserStatsService } from "src/userstats/userstats.service";
import { InviteDto } from "./dto/invite-game.dto";
import { Socket } from "socket.io";


@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
        private userStatsService: UserStatsService,
    ) {
    }


    gameRooms: GameRoomDto[] = [];
    queue: number[] = [];
    modeQueue: number[] = [];
    inviteQueue: InviteDto[] = [];

    /* C(reate) */
    async createGame(data: GameDto) {
        try {
            const [winner, loser] = this.getGameWinnerLoser(data);

            const createGameDto = {
                winnerScore: winner.points,
                loserScore: loser.points,
                winnerId: winner.id,
                loserId: loser.id,
            }
            const newGame = await this.prisma.game.create({
                data: {
                    users: {
                        connect: [
                            { id: createGameDto.winnerId },
                            { id: createGameDto.loserId }
                        ],
                    },
                    winner: { connect: { id: createGameDto.winnerId } },
                    loser: { connect: { id: createGameDto.loserId } },
                    winnerScore: createGameDto.winnerScore,
                    loserScore: createGameDto.loserScore,
                },
            });

            await this.userStatsService.eloComputing(createGameDto.winnerId, createGameDto.loserId);
            return newGame;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    /* R(ead) */
    async getGame(id: number) {
        const game = await this.prisma.game.findUniqueOrThrow({
            include: { loser: true, winner: true },
            where: { id: id },
        });
        return game;
    }

    async getGames(userId: number): Promise<GetGameDto[]> {
        const games = await this.prisma.game.findMany({
            orderBy: { createdAt: 'desc' },
            include: { loser: true, winner: true },
            where: { users: { some: { id: userId } } },
        });

        const gameDtos: GetGameDto[] = games.map((game) => {
            const winnerDto: GameUserDto = {
                id: game.winner.id,
                username: game.winner.username,
            };

            const loserDto: GameUserDto = {
                id: game.loser.id,
                username: game.loser.username,
            };

            return {
                id: game.id,
                createdAt: game.createdAt,
                gameDuration: game.gameDuration,
                winnerScore: game.winnerScore,
                loserScore: game.loserScore,
                winner: winnerDto,
                loser: loserDto,
            };
        });
        return gameDtos;
    }

    async getGamesAsc(userId: number): Promise<GetGameDto[]> {
        const games = await this.prisma.game.findMany({
            orderBy: { createdAt: 'asc' },
            include: { loser: true, winner: true },
            where: { users: { some: { id: userId } } },
        });

        const gameDtos: GetGameDto[] = games.map((game) => {
            const winnerDto: GameUserDto = {
                id: game.winner.id,
                username: game.winner.username,
            };

            const loserDto: GameUserDto = {
                id: game.loser.id,
                username: game.loser.username,
            };

            return {
                id: game.id,
                createdAt: game.createdAt,
                gameDuration: game.gameDuration,
                winnerScore: game.winnerScore,
                loserScore: game.loserScore,
                winner: winnerDto,
                loser: loserDto,
            };
        });
        return gameDtos;
    }

    async getIsQueued(userId: number): Promise<boolean> {
        const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
        if (idx === -1) {
            if (this.queue.find(user => user === userId)) {
                return true;
            }
        }
        return false;
    }

    /* U(pdate) */
    //TODO: now useless, remove when game finished
    async updateGame(updateGameDto: UpdateGameDto) {
        const game = await this.prisma.game.update({
            where: { id: updateGameDto.gameId },
            data: {
                winner: { connect: { id: updateGameDto.winnerId } },
                loser: { connect: { id: updateGameDto.loserId } },
                winnerScore: updateGameDto.winnerScore,
                loserScore: updateGameDto.loserScore,
            },
        });
        return game;
    }        // console.log(this)

    //TODO: now useless, remove when game finished
    async joinGame(joinGameDto: JoinGameDto) {
        const game = await this.prisma.game.update({
            where: { id: joinGameDto.gameId },
            data: {
                users: { connect: { id: joinGameDto.playerTwoId } },
            },
        });
        return game;
    }

    /* D(elete) */
    async deleteGame(deleteGameDto: any) {
        this.prisma.game.delete({
            where: { id: deleteGameDto.gameId },
        });
        return true;
    }

    //=================================================//
    //============= HANDLE SOCKET EVENTS ==============//
    //=================================================//

    async handleInvite(clients: readonly Socket[], invitorId: number, invitedId: number, invitedUsername: string, invitorSocket: Socket, mode: boolean) {
        const playersAreAlreadyInQueue: number = this.inviteQueue.findIndex(q => q.invitorId === invitorId && q.invitedId === invitedId);
        const invitedIsAlreadyInvited: number = this.inviteQueue.findIndex(q => q.invitedId === invitedId);
        const invitedIsAlreadyInvitor: number = this.inviteQueue.findIndex(q => q.invitorId === invitedId);
        const invitorIsAlreadyInvited: number = this.inviteQueue.findIndex(q => q.invitedId === invitorId);
        const invitedIsInGame: boolean = await this.isInGame(invitedId);

        if (invitedIsInGame || playersAreAlreadyInQueue !== -1 || invitedIsAlreadyInvited !== -1 || invitedIsAlreadyInvitor !== -1) {
            if (playersAreAlreadyInQueue === -1 && invitedIsAlreadyInvited !== -1) {
                console.log("is already invited by someone else")
                invitorSocket?.emit('isAlreadyInGame', { invitedUsername });
            }
            else if (playersAreAlreadyInQueue !== -1) {
                console.log("is already in queue with me")
            }
            return false;
        }
        else if (invitorIsAlreadyInvited !== -1) {
            console.log("is already invited me")
            const idx: number = this.inviteQueue.findIndex(q => q.invitedId === invitorId);
            const invitorIdToNotify = this.inviteQueue[idx].invitorId;
            const invitorSocketIdsToNotify = await this.userService.getSocketIdsFromUserId(invitorIdToNotify);
            
            invitorSocketIdsToNotify.forEach(invitorSocketIdToNotify => {
                const invitorSocketToNotify = clients.find(c => c.id === invitorSocketIdToNotify);
                invitorSocketToNotify?.emit('inviteDeclined');
            });
            this.inviteQueue.splice(idx, 1);
        }
        console.log("handleInvite found a queue to add")
        this.inviteQueue.push({ invitorId: invitorId, invitedId: invitedId, mode: mode });
        return true;
    }

    async handleRemoveQueue(invitorId: number, invitedId: number) {
        const idx: number = this.inviteQueue.findIndex(q => q.invitorId === invitorId && q.invitedId === invitedId);
        if (idx === -1) {
            console.log("handleCancelInvite did not find a queue to remove")
            return;
        }
        console.log("handleCancelInvite found a queue to remove")
        this.inviteQueue.splice(idx, 1);
    }

    async handleRespondToInvite(invitorSocket: Socket, invitorId: number, invitedId: number, accept: boolean): Promise<InviteDto> {
        const idx: number = this.inviteQueue.findIndex(q => q.invitorId === invitorId && q.invitedId === invitedId);
        console.log("1");
        if (idx === -1)
            return;
        console.log("2");
        if (!accept) {
            this.inviteQueue.splice(idx, 1);
            console.log("declined by ", invitorSocket.id)
            invitorSocket?.emit('inviteDeclined');
            return;
        }
        console.log("3");
        if (await this.isInGame(invitorId))
            return;
        console.log("4");
        if (await this.isInGame(invitedId))
            return;
        console.log("5");
        invitorSocket?.emit('inviteAccepted');
        return (this.inviteQueue[idx]);
    }

    async handleJoinQueue(userId: number, mode: boolean): Promise<{ newGameRoom: GameRoomDto, player1SocketIds: string[], player2SocketIds: string[] }> {
        try {
            const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
            if (idx === -1) {
                if (this.queue.find(user => user === userId) || this.modeQueue.find(user => user === userId)) {
                    return;
                }
                if (mode) {
                    this.modeQueue.push(userId);
                    if (this.modeQueue.length >= 2)
                        return this.handleJoinGame(mode);
                }
                else {
                    this.queue.push(userId);
                    if (this.queue.length >= 2)
                        return this.handleJoinGame(mode);
                }
            }
            else {
                const newGameRoom: GameRoomDto = this.gameRooms[idx];
                const player1SocketIds: string[] = [];
                const player2SocketIds: string[] = [];
                return ({ newGameRoom, player1SocketIds, player2SocketIds });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async handleJoinGame(mode: boolean): Promise<{ newGameRoom: GameRoomDto, player1SocketIds: string[], player2SocketIds: string[] }> {
        let player1Id: number;
        let player2Id: number;
        if (mode) {
            player2Id = this.modeQueue.shift();
            player1Id = this.modeQueue.shift();
        }
        else {
            player2Id = this.queue.shift();
            player1Id = this.queue.shift();
        }

        // create room data
        const newGameRoom: GameRoomDto = await this.setGameRoom(player1Id, player2Id, mode);
        const player1SocketIds: string[] = await this.userService.getSocketIdsFromUserId(player1Id);
        const player2SocketIds: string[] = await this.userService.getSocketIdsFromUserId(player2Id);
        // add room to rooms list
        this.gameRooms.push(newGameRoom);
        // pop player from queue list
        this.handleLeaveQueue(player1Id);
        this.handleLeaveQueue(player2Id);

        return ({ newGameRoom, player1SocketIds, player2SocketIds });
    }


    async handleLaunchGame(id: number, userId: number): Promise<GameRoomDto> {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("game.service-handleLaunchGame: !LaunchGameRoom")
            return;
        }
        if (this.gameRooms[idx].playerOneId === userId)
            this.gameRooms[idx].readyPlayerOne = true;
        else if (this.gameRooms[idx].playerTwoId === userId)
            this.gameRooms[idx].readyPlayerTwo = true;
        if (this.gameRooms[idx].readyPlayerOne === true && this.gameRooms[idx].readyPlayerTwo === true)
            return this.gameRooms[idx];
    }

    handleLeaveQueue(userId: number) {
        const modeidx = this.modeQueue.findIndex(user => user === userId);

        if (modeidx !== -1)
            this.modeQueue.splice(modeidx, 1);
        else {
            const idx = this.queue.findIndex(user => user === userId);
            if (idx === -1)
                return
            this.queue.splice(idx, 1);
        }
    }

    handleMove(event: string, id: number, userId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("game.service-handleMove: !MoveGameRoom")
            return;
        }
        const player1 = this.gameRooms[idx].data.player1;
        const player2 = this.gameRooms[idx].data.player2;

        if (player1.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, player1);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, player1);

            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft")
                    this.setVelocitx(-0.01, player1);
                else if (event === "ArrowRight")
                    this.setVelocitx(0.005, player1);
            }
        }
        else if (player2.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, player2);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, player2);

            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft")
                    this.setVelocitx(-0.005, player2);
                else if (event === "ArrowRight")
                    this.setVelocitx(0.01, player2);
            }
        }

    }

    handleStopMove(event: string, id: number, userId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("game.service-handleStopMove: !StopMoveGameRoom")
            return;
        }
        if (this.gameRooms[idx].data.player1.id === userId) {
            if (event === "ArrowUp")
                this.killVelocity(this.gameRooms[idx].data.player1);
            else if (event === "ArrowDown")
                this.killVelocity(this.gameRooms[idx].data.player1);
            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft" || event === "ArrowRight")
                    this.killVelocitx(this.gameRooms[idx].data.player1);
            }
        }
        else {
            if (event === "ArrowUp")
                this.killVelocity(this.gameRooms[idx].data.player2);
            else if (event === "ArrowDown")
                this.killVelocity(this.gameRooms[idx].data.player2);
            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft" || event === "ArrowRight")
                    this.killVelocitx(this.gameRooms[idx].data.player2);
            }
        }
    }

    async removeRoom(gameId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === gameId);
        if (idx === -1)
            return;
        this.gameRooms.splice(idx, 1);
    }

    async getDataFromRoomId(id: number): Promise<GameDto> {
        return this.gameRooms.find(game => game.id === id).data;
    }

    async isInGame(userId: number): Promise<boolean> {
        if (this.gameRooms.find(game => game.playerOneId === userId || game.playerTwoId === userId) !== undefined) {
            return true;
        }
        return false;
    }

    async getDataFromUserId(userId: number): Promise<GameDto> {
        return this.gameRooms.find(game => game.playerOneId === userId || game.playerTwoId === userId)?.data;
    }

    async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async surrender(id: number, forfeiterId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("Could not find game with id:", id);
            return;
        }
        this.gameRooms[idx].data.forfeiterId = forfeiterId;
        this.gameRooms[idx].data.end = true;
    }

    //=================================================//
    //================== GAME PLAY ====================//
    //=================================================//
    /* GamePlay Player */
    async incrPoints(idx: number, player: number) {
        if (player === 1)
            this.gameRooms[idx].data.player1.points++;
        else
            this.gameRooms[idx].data.player2.points++;
    }

    async setVelocity(val: number, player: PlayerDto) {
        player.velocity = val;
    }

    async killVelocity(player: PlayerDto) {
        player.velocity = 0;
    }

    async setVelocitx(val: number, player: PlayerDto) {
        player.velocitx = val;
    }

    async killVelocitx(player: PlayerDto) {
        player.velocitx = 0;
    }

    async movePlayerMode(player: PlayerDto) {
        const valy: number = player.y + player.velocity;
        const valx: number = player.x + player.velocitx;

        if (valy >= 1)
            player.y = valy - 1;
        else if (valy <= 0)
            player.y = 1 + valy;
        else
            player.y = valy;

        if (valx < 0.48 && valx > 0.02 || valx > 0.52 && valx < 0.98)
            player.x = valx;
        else
            this.killVelocitx(player);
    }

    async movePlayer(player: PlayerDto) {
        const val: number = player.y + player.velocity;
        if (player.velocity > 0) {
            if (val + player.h / 2 < 0.99)
                player.y = val;
        }
        else {
            if (val - player.h / 2 > 0.01)
                player.y = val;
        }
    }

    async calculatePlayer(idx: number, mode: boolean) {
        if (mode) {
            this.movePlayerMode(this.gameRooms[idx].data.player1);
            this.movePlayerMode(this.gameRooms[idx].data.player2);
        }
        else {
            this.movePlayer(this.gameRooms[idx].data.player1);
            this.movePlayer(this.gameRooms[idx].data.player2);
        }
    }

    /* GamePlay Ball */
    //========== BOUNCES =============//
    async bounce(idx: number, ball: BallDto) {
        const player1 = this.gameRooms[idx].data.player1;
        const player2 = this.gameRooms[idx].data.player2;
        this.borderBounce(ball);
        this.paddleBounce(ball, player1, player2);
        this.score(idx);
    };

    //>>BORDER<<//
    async borderBounce(ball: BallDto) {
        if (ball.y - ball.r <= 0 || ball.y + ball.r >= 1)
            ball.speed[1] *= -1;
    }

    //>>PADDLE<//
    async paddleBounce(ball: BallDto, player1: PlayerDto, player2: PlayerDto) {
        this.playerCollision(ball, player1);
        this.playerCollision(ball, player2);
    }

    checkCollision(ball: BallDto, player: PlayerDto): boolean {
        const dy: number = Math.abs(ball.y - player.y);

        if (dy <= player.h / 2)
            return true;
        else if ((player.y + player.h / 2) > 1) {
            if (ball.y - ball.r <= ((player.h / 2) - (1 - player.y)))
                return true;
        }
        else if (player.y - player.h / 2 < 0) {
            if (ball.y + ball.r >= (1 - (player.h / 2 - player.y)))
                return true;
        }
        return false;
    }

    async playerCollision(ball: BallDto, player: PlayerDto) {

        let dx: number;
        // if ( o | )
        if (ball.x < player.x)
            dx = Math.abs(player.x - player.w - ball.x + ball.r);
        // else ( | o )
        else
            dx = Math.abs(ball.x - ball.r - player.x + player.w);

        if (dx <= (ball.r + player.w) && this.checkCollision(ball, player) === true) {
            const coef = 10 * (ball.y - player.y);
            const radian = (coef * player.angle) * (Math.PI / 180);

            if (ball.x < player.x)
                ball.speed[0] = -Math.abs(ball.speed[0]);
            else
                ball.speed[0] = Math.abs(ball.speed[0]);

            if (player.velocitx > 0)
                ball.speed[0] += 0.03;
            else if (player.velocitx < 0)
                ball.speed[0] -= 0.03;
            ball.speed[1] = Math.sin(radian);
        }
    }

    //========== SCORE =============//
    async score(idx: number) {
        if (this.gameRooms[idx].data.ball.x <= 0) {
            this.incrPoints(idx, 2);
            this.reset(idx);
        }
        else if (this.gameRooms[idx].data.ball.x >= 1) {
            this.incrPoints(idx, 1);
            this.reset(idx);
        }
    }

    //========== RESET BALL =============//
    async reset(idx: number) {
        this.gameRooms[idx].data.ball.x = 0.5;
        this.gameRooms[idx].data.ball.y = 0.5;
        let sign = 1;

        if (Math.random() < 0.5)
            sign *= -1;
        this.gameRooms[idx].data.ball.speed[0] = 0.3 * sign;

        if (Math.random() < 0.5)
            sign *= -1;
        this.gameRooms[idx].data.ball.speed[1] = Math.random() * (0.8 - 0.2) + 0.2 * sign;
    }

    //========== MOVEMENT =============//
    //>>ACCELERATION<<//
    async incrementSpeed(ball: BallDto) {
        ball.incr++;
        if (ball.incr === 10) {
            ball.speed[0] += 0.01 * ball.speed[0];
            ball.incr = 0;
        }
    }

    //>>UPDATE POSITION<<//
    async updateBall(ball: BallDto) {
        ball.x += ball.speed[0] / 100;
        ball.y += ball.speed[1] / 100;
    };

    //>>CALCUL POSITION<<//
    async calculateBall(idx: number) {
        const ball = this.gameRooms[idx].data.ball;
        this.bounce(idx, ball);
        this.updateBall(ball);
        this.incrementSpeed(ball);
    };

    async calculateGame(idx: number, mode: boolean): Promise<GameDto> {

        this.calculatePlayer(idx, mode);
        this.calculateBall(idx);
        if (this.gameRooms[idx].data.player1.points > 10 || this.gameRooms[idx].data.player2.points > 10)
            this.gameRooms[idx].data.end = true;

        return { ...this.gameRooms[idx].data };
    }

    //=================================================//
    //================== INIT GAME ==================//
    //=================================================//
    async setGameRoom(player1Id: number, player2Id: number, mode: boolean): Promise<GameRoomDto> {
        const id: number = this.gameRooms.length;
        const roomName: string = player1Id + "_" + player2Id;
        const newGameRoom: GameRoomDto = {
            id: id,
            roomName: roomName,
            playerOneId: player1Id,
            playerTwoId: player2Id,
            readyPlayerOne: false,
            readyPlayerTwo: false,
            reconnect: false,
            data: this.setGameData(id, roomName, player1Id, player2Id, mode)
        }
        return newGameRoom;
    }

    setGameData(id: number, roomName: string, playerOneId: number, playerTwoId: number, mode: boolean): GameDto {
        let player1: PlayerDto = {
            id: playerOneId,
            color: '#cba6f7aa',
            x: 0.02,
            y: 0.5,
            w: 0.01,
            h: 0.15,
            velocity: 0,
            velocitx: 0,
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
            velocitx: 0,
            angle: 60,
            points: 0,
        }

        let ball: BallDto = {
            color: '#cba6f7',
            x: 0.5,
            y: 0.5,
            r: 0.01,
            pi2: Math.PI * 2,
            speed: [0.3, Math.random() * (0.8 - 0.2) + 0.2],
            incr: 0,
        }

        let data: GameDto = {
            id: id,
            roomName: roomName,
            forfeiterId: null,
            end: false,
            mode: mode,
            player1: player1,
            player2: player2,
            ball: ball,
        }


        return data;
    }

    getGameWinnerLoser(data: GameDto): [PlayerDto, PlayerDto] {

        if (data.forfeiterId) {
            if (data.forfeiterId === data.player1.id) {
                return [data.player2, data.player1]
            }
            if (data.forfeiterId === data.player2.id) {
                return [data.player1, data.player2]
            }
        }
        if (data.player1.points > data.player2.points)
            return [data.player1, data.player2];
        return [data.player2, data.player1];
    }
}

