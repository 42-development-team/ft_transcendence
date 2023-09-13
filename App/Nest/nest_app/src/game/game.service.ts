import { PrismaService } from "src/prisma/prisma.service";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Injectable } from "@nestjs/common";
import { BallDto, GameDto, PlayerDto } from "./dto/game-data.dto";
import { GameUserDto } from "./dto/game-user.dto";
import { GetGameDto } from "./dto/get-game.dto";
//===========
import { Socket } from 'socket.io';
import { GameRoomDto } from "./dto/create-room.dto";
import { UserIdDto } from "src/userstats/dto/user-id.dto";
import { UsersService } from "src/users/users.service";


@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
    ) { }

    gameRooms: GameRoomDto[] = [];
    queued: UserIdDto[] = [];


    /* C(reate) */
    async createGame(data: GameDto) {

        const createGameDto = {
            winnerScore: Math.max(data.player1.points, data.player2.points),
            loserScore: Math.min(data.player1.points, data.player2.points),
            winnerId: data.player1.points > data.player2.points ? data.player1.id : data.player2.id,
            loserId: data.player1.points > data.player2.points ? data.player2.id : data.player1.id,
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
        return newGame;
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

    async getIsQueued(userId: number): Promise<boolean> {
        const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
        if (idx === -1) {
            console.log("LADEDANS")
            if (this.queued.find(user => user.userId === userId)) {
                console.log("user:", userId, ":Loading")
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
    }

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

    async handleJoinQueue(player: Socket): Promise<{ newGameRoom: GameRoomDto, player2SocketId: string }> {
        try {
            const userId = await this.userService.getUserIdFromSocket(player);
            const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
            if (idx === -1) {
                if (this.queued.find(user => user.userId === userId)) {
                    console.log("user:", userId, ":ALREADY QUEUED")
                    return;
                }
                this.queued.push({ userId });
                if (this.queued.length >= 2)
                    return this.handleJoinGame(player);
            }
            else {
                console.log("FOUND")
                const newGameRoom: GameRoomDto = this.gameRooms[idx];
                const player2SocketId: string = undefined;
                player?.join(this.gameRooms[idx].roomName);
                return ({ newGameRoom, player2SocketId });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async handleJoinGame(player: Socket): Promise<{ newGameRoom: GameRoomDto, player2SocketId: string }> {
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
            readyPlayerOne: false,
            readyPlayerTwo: false,
            reconnect: false,
            data: this.setGameData(id, roomName, player1Id, player2Id),
        }

        // add room to rooms list
        this.gameRooms.push(newGameRoom);
        // pop player from queue list
        this.handleLeaveQueue(this.queued[0]);
        this.handleLeaveQueue(this.queued[1]);

        // Create room instance and join room
        await player?.join(roomName);

        const player2SocketId: string = await this.userService.getUserSocketFromId(player2Id);
        return ({ newGameRoom, player2SocketId });
    }

    async handleLaunchGame(id: number, userId: number): Promise<GameRoomDto> {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("!LaunchGameRoom")
            return;
        }

        if (this.gameRooms[idx].playerOneId === userId)
            this.gameRooms[idx].readyPlayerOne = true;
        else if (this.gameRooms[idx].playerTwoId === userId)
            this.gameRooms[idx].readyPlayerTwo = true;
        if (this.gameRooms[idx].readyPlayerOne === true && this.gameRooms[idx].readyPlayerTwo === true)
            return this.gameRooms[idx];
    }

    handleLeaveQueue(userId: UserIdDto) {
        const playerIndex = this.queued.indexOf(userId);
        this.queued.splice(playerIndex, 1);
    }

    handleMove(event: string, id: number, userId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("!MoveGameRoom")
            return;
        }
        if (this.gameRooms[idx].data.player1.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, this.gameRooms[idx].data.player1);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, this.gameRooms[idx].data.player1);
        }
        else if (this.gameRooms[idx].data.player2.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, this.gameRooms[idx].data.player2);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, this.gameRooms[idx].data.player2);
        }
    }

    handleStopMove(event: string, id: number, userId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1) {
            console.log("!StopMoveGameRoom")
            return;
        }
        if (this.gameRooms[idx].data.player1.id === userId) {
            if (event === "ArrowUp")
                this.killVelocity(this.gameRooms[idx].data.player1);
            else if (event === "ArrowDown")
                this.killVelocity(this.gameRooms[idx].data.player1);
        }
        else {
            if (event === "ArrowUp")
                this.killVelocity(this.gameRooms[idx].data.player2);
            else if (event === "ArrowDown")
                this.killVelocity(this.gameRooms[idx].data.player2);
        }
    }

    async removeRoom(roomName: string) {
        const idx: number = this.gameRooms.findIndex(game => game.roomName === roomName);
        if (idx === -1)
            return;
        this.gameRooms.splice(idx, 1);
    }

    async getDataFromRoomId(id: number): Promise<GameDto> {
        return this.gameRooms.find(game => game.id === id)?.data;
    }

    async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    async move(player: PlayerDto) {
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

    async calculatePlayer(idx: number) {
        this.move(this.gameRooms[idx].data.player1);
        this.move(this.gameRooms[idx].data.player2);
    }

    /* GamePlay Ball */
    //========== BOUNCES =============//
    async bounce(idx: number) {
        this.borderBounce(idx);
        this.paddleBounce(idx);
        this.score(idx);
    };

    //>>BORDER<<//
    async borderBounce(idx: number) {
        if (this.gameRooms[idx].data.ball.y - this.gameRooms[idx].data.ball.r <= 0 || this.gameRooms[idx].data.ball.y + this.gameRooms[idx].data.ball.r >= 1)
            this.gameRooms[idx].data.ball.speed[1] *= -1;
    }

    //>>PADDLE<//
    async paddleBounce(idx: number) {
        if (this.gameRooms[idx].data.ball.speed[0] < 0)
            this.paddleLeftBounce(idx);
        else
            this.paddleRightBounce(idx);
    }

    async paddleLeftBounce(idx: number) {
        let dx = Math.abs(this.gameRooms[idx].data.ball.x + this.gameRooms[idx].data.ball.r - this.gameRooms[idx].data.player1.x);
        let dy = Math.abs(this.gameRooms[idx].data.ball.y - this.gameRooms[idx].data.player1.y);

        if (dx <= (this.gameRooms[idx].data.ball.r + this.gameRooms[idx].data.player1.w)) {
            if (dy <= (this.gameRooms[idx].data.ball.r + this.gameRooms[idx].data.player1.h / 2)) {
                const coef = 10 * (this.gameRooms[idx].data.ball.y - this.gameRooms[idx].data.player1.y);
                const radian = (coef * this.gameRooms[idx].data.player1.angle) * (Math.PI / 180);
                this.gameRooms[idx].data.ball.speed[0] *= -1;
                this.gameRooms[idx].data.ball.speed[1] = Math.sin(radian);
            }
        }
    };

    async paddleRightBounce(idx: number) {

        let dx = Math.abs(this.gameRooms[idx].data.ball.x - this.gameRooms[idx].data.ball.r - this.gameRooms[idx].data.player2.x);
        let dy = Math.abs(this.gameRooms[idx].data.ball.y - this.gameRooms[idx].data.player2.y);

        if (dx <= (this.gameRooms[idx].data.ball.r + this.gameRooms[idx].data.player2.w)) {
            if (dy <= (this.gameRooms[idx].data.ball.r + this.gameRooms[idx].data.player2.h / 2)) {
                const coef = 10 * (this.gameRooms[idx].data.ball.y - this.gameRooms[idx].data.player2.y);
                const radian = (coef * this.gameRooms[idx].data.player2.angle) * (Math.PI / 180);
                this.gameRooms[idx].data.ball.speed[0] *= -1;
                this.gameRooms[idx].data.ball.speed[1] = Math.sin(radian);
            }
        }
    };

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
        this.gameRooms[idx].data.ball.speed[1] = Math.random() * (0.8 - 0.5) + 0.5 * sign;
    }

    //========== MOVEMENT =============//
    //>>ACCELERATION<<//
    async incrementSpeed(idx: number) {
        this.gameRooms[idx].data.ball.incr++;
        if (this.gameRooms[idx].data.ball.incr === 10) {
            this.gameRooms[idx].data.ball.speed[0] += 0.01 * this.gameRooms[idx].data.ball.speed[0];
            this.gameRooms[idx].data.ball.incr = 0;
        }
    }

    //>>UPDATE POSITION<<//
    async updateBall(idx: number) {
        this.gameRooms[idx].data.ball.x += this.gameRooms[idx].data.ball.speed[0] / 100;
        this.gameRooms[idx].data.ball.y += this.gameRooms[idx].data.ball.speed[1] / 100;
    };

    //>>CALCUL POSITION<<//
    async calculateBall(idx: number) {
        this.bounce(idx);
        this.updateBall(idx);
        this.incrementSpeed(idx);
    };

    async calculateGame(idx: number): Promise<GameDto> {

        this.calculatePlayer(idx);
        this.calculateBall(idx);
        if (this.gameRooms[idx].data.player1.points > 10 || this.gameRooms[idx].data.player2.points > 10)
            this.gameRooms[idx].data.end = true;

        return { ...this.gameRooms[idx].data };
    }

    //=================================================//
    //================== UPDATE GAME ==================//
    //=================================================//

    setGameData(id: number, roomName: string, playerOneId: number, playerTwoId: number): GameDto {
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
            speed: [0.3, Math.random() * (0.8 - 0.5) + 0.5],
            incr: 0,
        }

        let data: GameDto = {
            id: id,
            roomName: roomName,
            end: false,
            player1: player1,
            player2: player2,
            ball: ball,
        }

        return data;
    }
}
