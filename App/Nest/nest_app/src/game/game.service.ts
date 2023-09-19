import { PrismaService } from "src/prisma/prisma.service";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Injectable, Redirect } from "@nestjs/common";
import { BallDto, GameDto, PlayerDto } from "./dto/game-data.dto";
import { GameUserDto } from "./dto/game-user.dto";
import { GetGameDto } from "./dto/get-game.dto";
//===========
import { Socket } from 'socket.io';
import { GameRoomDto } from "./dto/create-room.dto";
import { UsersService } from "src/users/users.service";


@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
    ) { }

    gameRooms: GameRoomDto[] = [];
    queue: number[] = [];
    modeQueue: number[] = [];

    /* C(reate) */
    async createGame(data: GameDto) {

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

    async surrender(id: number, forfeiterId: number) {
        const idx: number = this.gameRooms.findIndex(game => game.id === id);
        if (idx === -1 ) {
            console.log("Could not find game with id:", id);
            return ;
        }
        this.gameRooms[idx].data.forfeiterId = forfeiterId;
        this.gameRooms[idx].data.end = true;
    }
    
    async handleJoinQueue(player: Socket, mode: boolean): Promise<{ newGameRoom: GameRoomDto, player2SocketId: string }> {
        try {
            const userId: number = await this.userService.getUserIdFromSocket(player);
            const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
            if (idx === -1) {
                if (this.queue.find(user => user === userId) || this.modeQueue.find(user => user === userId)) {
                    return;
                }
                if (mode) {
                    this.modeQueue.push(userId);
                    if (this.modeQueue.length >= 2)
                        return this.handleJoinGame(player, mode);
                }
                else {
                    this.queue.push(userId);
                    if (this.queue.length >= 2)
                        return this.handleJoinGame(player, mode);
                }
            }
            else {
                const newGameRoom: GameRoomDto = this.gameRooms[idx];
                const player2SocketId: string = undefined;
                player?.join(this.gameRooms[idx].roomName);
                return ({ newGameRoom, player2SocketId });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async handleJoinGame(player: Socket, mode: boolean): Promise<{ newGameRoom: GameRoomDto, player2SocketId: string }> {
        let player1Id: number;
        let player2Id: number;
        if (mode) {
            player2Id = this.modeQueue[0];
            player1Id = this.modeQueue[1];
        }
        else {
            player2Id = this.queue[0];
            player1Id = this.queue[1];
        }

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
            data: this.setGameData(id, roomName, player1Id, player2Id, mode)
        }

        // add room to rooms list
        this.gameRooms.push(newGameRoom);
        // pop player from queue list
        this.handleLeaveQueue(player1Id);
        this.handleLeaveQueue(player2Id);

        // Create room instance and join room
        await player?.join(roomName);

        const player2SocketId: string = await this.userService.getUserSocketFromId(player2Id);
        return ({ newGameRoom, player2SocketId });
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
        if (this.gameRooms[idx].data.player1.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, this.gameRooms[idx].data.player1);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, this.gameRooms[idx].data.player1);
            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft")
                    this.setVelocitx(-0.005, this.gameRooms[idx].data.player1);
                else if (event === "ArrowRight")
                    this.setVelocitx(0.005, this.gameRooms[idx].data.player1);
            }
        }
        else if (this.gameRooms[idx].data.player2.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, this.gameRooms[idx].data.player2);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, this.gameRooms[idx].data.player2);
            if (this.gameRooms[idx].data.mode) {
                if (event === "ArrowLeft")
                    this.setVelocitx(-0.005, this.gameRooms[idx].data.player2);
                else if (event === "ArrowRight")
                    this.setVelocitx(0.005, this.gameRooms[idx].data.player2);
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

    async getDataFromUserId(userId: number): Promise<GameDto> {
        return this.gameRooms.find(game => game.playerOneId === userId || game.playerTwoId === userId)?.data;
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
    async bounce(idx: number, mode: boolean) {
        const ball = this.gameRooms[idx].data.ball;
        const player1 = this.gameRooms[idx].data.player1;
        const player2 = this.gameRooms[idx].data.player2;
        this.borderBounce(ball);
        this.paddleBounce(ball, player1, player2, mode);
        this.score(idx);
    };

    //>>BORDER<<//
    async borderBounce(ball: BallDto) {
        if (ball.y - ball.r <= 0 || ball.y + ball.r >= 1)
            ball.speed[1] *= -1;
    }

    //>>PADDLE<//
    async paddleBounce(ball: BallDto, player1: PlayerDto, player2: PlayerDto, mode: boolean) {
        // if (mode) {
            this.paddleModePlayer(ball, player1);
            this.paddleModePlayer(ball, player2);
        // }
        // else {
            // this.paddleLeftBounce(idx);
            // this.paddleRightBounce(idx);
        // }
    }

    async paddleModePlayer(ball: BallDto, player: PlayerDto) {
        // const ball = this.gameRooms[idx].data.ball;
        // const player = this.gameRooms[idx].data.player1;

        let dx: number;
        const dy: number = Math.abs(ball.y - player.y);
        // if ( o | )
        if (ball.x < player.x) {
            dx = Math.abs(player.x - player.w - ball.x + ball.r);
        }
        // else ( | o )
        else {
            dx = Math.abs(ball.x - ball.r - player.x + player.w);
        }
        if (dx <= (ball.r + player.w) && dy <= (ball.r + player.h / 2)) {
            
            const coef = 10 * (ball.y - player.y);
            const radian = (coef * player.angle) * (Math.PI / 180);
            
            if (ball.x < player.x)
                ball.speed[0] = -Math.abs(ball.speed[0]);
            else
                ball.speed[0] = Math.abs(ball.speed[0]);

            if (player.velocitx > 0) {
                ball.speed[0] += 0.03;
            }
            else if (player.velocitx < 0) {
                ball.speed[0] -= 0.03;
            }
            console.log("speed:", ball.speed[0]);
            
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

        // CHANGE
        // if (Math.random() < 0.5)
        //     sign *= -1;
        // this.gameRooms[idx].data.ball.speed[0] = 0.3 * sign;
        this.gameRooms[idx].data.ball.speed[0] = -0.3;

        // if (Math.random() < 0.5)
        //     sign *= -1;
        // this.gameRooms[idx].data.ball.speed[1] = Math.random() * (0.8 - 0.5) + 0.5 * sign;
        this.gameRooms[idx].data.ball.speed[1] = 0;
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
    async calculateBall(idx: number, mode: boolean) {
        this.bounce(idx, mode);
        this.updateBall(idx);
        this.incrementSpeed(idx);
    };

    async calculateGame(idx: number, mode: boolean): Promise<GameDto> {

        this.calculatePlayer(idx, mode);
        this.calculateBall(idx, mode);
        if (this.gameRooms[idx].data.player1.points > 10 || this.gameRooms[idx].data.player2.points > 10)
            this.gameRooms[idx].data.end = true;

        return { ...this.gameRooms[idx].data };
    }

    //=================================================//
    //================== UPDATE GAME ==================//
    //=================================================//

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
            // speed: [0.3, Math.random() * (0.8 - 0.5) + 0.5],
            // CHANGE
            speed: [-0.3, 0],
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

