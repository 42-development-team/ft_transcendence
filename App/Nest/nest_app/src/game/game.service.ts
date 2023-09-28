import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
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
    ) {}


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
        const game: GameRoomDto = this.gameRooms.find(game => game.playerOneId === userId || game.playerTwoId === userId);
        if (game === undefined) {
            if (this.queue.find(user => user === userId)) {
                return true;
            }
        }
        return false;
    }

    //=================================================//
    //============= HANDLE SOCKET EVENTS ==============//
    //=================================================//

    async invitorIsInvited(invitorId: number): Promise<number> {
        const idx: number = this.inviteQueue.findIndex(q => q.invitedId === invitorId);
        if (idx === -1)
            return -1;

        const idToNotify = this.inviteQueue[idx].invitorId;
        await this.handleRemoveInviteQueue(idToNotify, invitorId);
    
        return idToNotify;
    }

    async queueAlreadyExists(invitorId: number, invitedId: number): Promise<boolean> {
        const idx: number = this.inviteQueue.findIndex(q => (q.invitorId === invitorId && q.invitedId === invitedId) || (q.invitorId === invitedId && q.invitedId === invitorId));
        if (idx === -1)
            return false;
        return true;
    }

    async addInviteQueue(invitorId: number, invitedId: number, mode: boolean) {
        // const invitedIsAlreadyInvited: number = this.inviteQueue.findIndex(q => q.invitedId === invitedId);
        // const invitedIsAlreadyInvitor: number = this.inviteQueue.findIndex(q => q.invitorId === invitedId && q.invitedId === invitorId);
        this.inviteQueue.push({ invitorId: invitorId, invitedId: invitedId, mode: mode });
    }

    async handleRemoveInviteQueue(invitorId: number, invitedId: number) {
        console.log("IN REMOVEINVITEQUEUE:", this.gameRooms);
        const idx: number = this.inviteQueue.findIndex(q => q.invitorId === invitorId && q.invitedId === invitedId);
        if (idx === -1) {
            console.log("handleCancelInvite did not find a queue to remove")
            return;
        }
        console.log("handleCancelInvite found a queue to remove")
        this.inviteQueue.splice(idx, 1);
    }

    async handleRespondToInvite(invitorId: number, invitedId: number, accept: boolean): Promise<InviteDto> {
        const idx: number = this.inviteQueue.findIndex(q => q.invitorId === invitorId && q.invitedId === invitedId);
        if (!accept) {
            await this.handleRemoveInviteQueue(invitorId, invitedId);
            return;
        }
        else if (idx === -1)
            return;
        if (await this.isInGame(invitorId))
            return;
        if (await this.isInGame(invitedId))
            return;
        return (this.inviteQueue[idx]);
    }

    async handleJoinQueue(userId: number, mode: boolean): Promise<{ newGameRoom: GameRoomDto, player1SocketIds: string[], player2SocketIds: string[] }> {
        try {
            const game: GameRoomDto = this.gameRooms.find(game => game.playerOneId === userId || game.playerTwoId === userId);
            if (game === undefined) {
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
                const newGameRoom: GameRoomDto = game;
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
        // pop player from queue list
        this.handleLeaveQueue(player1Id);
        this.handleLeaveQueue(player2Id);

        return ({ newGameRoom, player1SocketIds, player2SocketIds });
    }


    async handleLaunchGame(id: number, userId: number): Promise<GameRoomDto> {
        const game: GameRoomDto = await this.getGameFromId(id);
        if (game === undefined) {
            console.log("game.service-handleLaunchGame: !LaunchGameRoom")
            return;
        }
        if (game.playerOneId === userId)
        game.readyPlayerOne = true;
        else if (game.playerTwoId === userId)
        game.readyPlayerTwo = true;
        if (game.readyPlayerOne === true && game.readyPlayerTwo === true)
            return game;
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

    async handleMove(event: string, id: number, userId: number) {
        const game: GameRoomDto = await this.getGameFromId(id);
        if (game === undefined) {
            console.log("game.service-handleMove: !MoveGameRoom")
            return;
        }
        const player1 = game.data.player1;
        const player2 = game.data.player2;

        if (player1.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, player1);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, player1);

            if (game.data.mode) {
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

            if (game.data.mode) {
                if (event === "ArrowLeft")
                    this.setVelocitx(-0.005, player2);
                else if (event === "ArrowRight")
                    this.setVelocitx(0.01, player2);
            }
        }

    }

    async handleStopMove(event: string, id: number, userId: number) {
        const game: GameRoomDto = await this.getGameFromId(id);
        if (game === undefined) {
            console.log("game.service-handleStopMove: !StopMoveGameRoom")
            return;
        }
        if (game.data.player1.id === userId) {
            if (event === "ArrowUp")
                this.killVelocity(game.data.player1);
            else if (event === "ArrowDown")
                this.killVelocity(game.data.player1);
            if (game.data.mode) {
                if (event === "ArrowLeft" || event === "ArrowRight")
                    this.killVelocitx(game.data.player1);
            }
        }
        else {
            if (event === "ArrowUp")
                this.killVelocity(game.data.player2);
            else if (event === "ArrowDown")
                this.killVelocity(game.data.player2);
            if (game.data.mode) {
                if (event === "ArrowLeft" || event === "ArrowRight")
                    this.killVelocitx(game.data.player2);
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

    async getGameFromId(id: number): Promise<GameRoomDto> {
        return this.gameRooms.find(game => game.id === id);
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
        const game: GameRoomDto = await this.getGameFromId(id);
        if (game === undefined) {
            console.log("Could not find game with id:", id);
            return;
        }
        game.data.forfeiterId = forfeiterId;
        game.data.end = true;
    }

    //=================================================//
    //================== GAME PLAY ====================//
    //=================================================//
    /* GamePlay Player */
    incrPoints(game: GameRoomDto, player: number) {
        if (player === 1)
        game.data.player1.points++;
        else
        game.data.player2.points++;
    }

    setVelocity(val: number, player: PlayerDto) {
        player.velocity = val;
    }

    killVelocity(player: PlayerDto) {
        player.velocity = 0;
    }

    setVelocitx(val: number, player: PlayerDto) {
        player.velocitx = val;
    }

    killVelocitx(player: PlayerDto) {
        player.velocitx = 0;
    }

    movePlayerMode(ball: BallDto, player: PlayerDto) {
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

    movePlayer(player: PlayerDto) {
        const val: number = player.y + player.velocity;
        if (player.velocity > 0) {
            if (val + player.h / 2 < 0.97)
                player.y = val;
        }
        else {
            if (val - player.h / 2 > 0.03)
                player.y = val;
        }
    }

    calculatePlayer(game: GameRoomDto, mode: boolean) {
        if (mode) {
            const ball = game.data.ball;
            this.movePlayerMode(ball, game.data.player1);
            this.movePlayerMode(ball, game.data.player2);
        }
        else {
            this.movePlayer(game.data.player1);
            this.movePlayer(game.data.player2);
        }
    }

    /* GamePlay Ball */
    //========== BOUNCES =============//
    // >>BORDER<< //
    borderBounce(ball: BallDto) {
        if (ball.y - ball.r <= 0 || ball.y + ball.r >= 1)
            ball.speed[1] *= -1;
    }

    //>>PADDLE<//
    lerp (A: number, B: number, t: number): number {
        return (A + (B - A) * t);
    }

    segmentColliding(ball: BallDto, player: PlayerDto, r: number): boolean {
        
        interface Point {
            x: number,
            y: number,
        }

        // ball is [AB]
        // player is [CD]
        const A: Point = {x: ball.x, y: ball.y};
        const B: Point = {x: ball.x + ball.speed[0] / 100, y: ball.y + ball.speed[1] / 100};
        const C: Point = {x: player.x, y: player.y - player.h / 2}
        const D: Point = {x: player.x, y: player.y + player.h / 2}

        const top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
        const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
        
        if (bottom !== 0) {
            const t: number = top / bottom;
            if (t >= 0 && t <= 1) {
                const x: number = this.lerp(A.x, B.x, t);
                const y: number = this.lerp(A.y, B.y, t);
                ball.x = x + 0.7 * r;
                ball.y = y;
                return true ;
            }
        }
        return false;
    }

    checkCollisionY(ball: BallDto, player: PlayerDto): boolean {
        const dy: number = Math.abs(ball.y - player.y);

            if (dy <= player.h / 2) {
                return true;
            }
            else if ((player.y + player.h / 2) > 1){
                if (ball.y - ball.r <= ((player.h / 2) - (1 - player.y))) {
                    return true;
                }
            }
            else if (player.y - player.h / 2 < 0) {
                if (ball.y + ball.r >=  (1 - (player.h / 2 - player.y))) {
                    return true;
                }
            }
        return false;
    }

    checkCollision(ball, player, r) {
        if (this.checkCollisionY(ball, player) === true) {
            return (this.segmentColliding(ball, player, r));
        }
    }
    
    playerCollision(ball: BallDto, player: PlayerDto, r: number) {

        const checkCol: boolean = this.checkCollision(ball, player, r);
        if (checkCol === true) {
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
    score(game: GameRoomDto) {
        if (game.data.ball.x <= 0) {
            this.incrPoints(game, 2);
            this.reset(game);
        }
        else if (game.data.ball.x >= 1) {
            this.incrPoints(game, 1);
            this.reset(game);
        }
    }

    //========== RESET BALL =============//
    reset(game: GameRoomDto) {
        game.data.ball.x = 0.5;
        game.data.ball.y = 0.5;
        let sign = 1;

        if (Math.random() < 0.5)
            sign *= -1;
            game.data.ball.speed[0] = 0.3 * sign;

        if (Math.random() < 0.5)
            sign *= -1;
            game.data.ball.speed[1] = Math.random() * (0.8 - 0.2) + 0.2 * sign;
    }

    //========== MOVEMENT =============//
    //>>ACCELERATION<<//
    incrementSpeed(ball: BallDto) {
        ball.incr++;
        if (ball.incr === 10) {
            ball.speed[0] += 0.01 * ball.speed[0];
            ball.incr = 0;
        }
    }

    //>>UPDATE POSITION<<//
    updateBall(ball: BallDto) {
        ball.x += ball.speed[0] / 100 ;
        ball.y += ball.speed[1] / 100;
    };

    //>>CALCUL POSITION<<//
    calculateBall(game: GameRoomDto) {
        const ball = game.data.ball;
        const player1 = game.data.player1;
        const player2 = game.data.player2;

        this.borderBounce(ball);
        this.playerCollision(ball, player1, ball.r);
        this.playerCollision(ball, player2, -ball.r);
        this.updateBall(ball);
        this.score(game);
        this.incrementSpeed(ball);
    };

    async calculateGame(game: GameRoomDto): Promise<GameDto> {

        this.calculatePlayer(game, game.data.mode);
        this.calculateBall(game);
        if (game.data.player1.points > 10 || game.data.player2.points > 10)
            game.data.end = true;
    
    return { ...game.data };
}

//=================================================//
//================== INIT GAME ====================//
//=================================================//
    async   setGameRoom(player1Id: number, player2Id: number, mode: boolean): Promise<GameRoomDto> {
        const id: number = player1Id * 350 * player2Id * 150;
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
        this.gameRooms.push(newGameRoom);
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

