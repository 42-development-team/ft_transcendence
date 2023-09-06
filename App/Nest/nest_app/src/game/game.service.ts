import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Injectable } from "@nestjs/common";
import { BallDto, GameDto, PlayerDto } from "./dto/game-data.dto";
import { GameUserDto } from "./dto/game-user.dto";
import { GetGameDto } from "./dto/get-game.dto";
//===========
import { Socket, Server } from 'socket.io';
import { GameRoomDto } from "./dto/create-room.dto";
import { UserIdDto } from "src/userstats/dto/user-id.dto";
import { UsersService } from "src/users/users.service";


@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
    ) {}

    gameRooms: GameRoomDto[] = [];
    queued: UserIdDto[] = [];


    /* C(reate) */
    async createGame(createGamedto: CreateGameDto) {
        
        const newGame = await this.prisma.game.create({
            data: {
                users: {
                    connect: [
                        { id: createGamedto.winnerId },
                        { id: createGamedto.loserId }
                    ],
                },
                winner: { connect: { id: createGamedto.winnerId } },
                loser: { connect: { id: createGamedto.loserId } },
                winnerScore: createGamedto.winnerScore,
                loserScore: createGamedto.loserScore,
            },
        });
        return newGame;
    }

    /* R(ead) */
    async getGame(id: number) {
        const game = await this.prisma.game.findUniqueOrThrow({
            include: { loser: true, winner: true},
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

    /* U(pdate) */
    //TODO: now useless, remove when game finished
    async updateGame(updateGameDto: UpdateGameDto) {
        const game = await this.prisma.game.update({
            where: { id: updateGameDto.gameId },
            data: {
                winner: { connect: {id: updateGameDto.winnerId} },
                loser: {connect: {id: updateGameDto.loserId} },
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
                users: { connect: {id: joinGameDto.playerTwoId} },
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

    async handleJoinQueue(player: Socket): Promise<[GameRoomDto, string]> {
        try {
            const userId = await this.userService.getUserIdFromSocket(player);
            const idx: number = this.gameRooms.findIndex(game => game.playerOneId === userId || game.playerTwoId === userId);
            if (idx === -1) {
                this.queued.push({userId});
                if (this.queued.length >= 2)
                   return this.handleJoinGame(player);
            }
            else {
                player?.join(this.gameRooms[idx].roomName);
                return ([this.gameRooms[idx], undefined]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async handleJoinGame(player: Socket): Promise<[GameRoomDto, string]> {
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
        return ([newGameRoom, player2SocketId]);
    }

    async handleLaunchGame(server: Server, id: number) {
        let data: GameDto = await this.getDataFromRoomId(id);
        if (!data) {
            console.log("!LaunchGame Data")
            return ;
        }
        this.update(server, data);
        const createGameDto = {
            winnerScore: Math.max(data.player1.points, data.player2.points),
            loserScore: Math.min(data.player1.points, data.player2.points),
            winnerId: data.player1.points > data.player2.points ? data.player1.id : data.player2.id,
            loserId: data.player1.points > data.player2.points ? data.player2.id : data.player1.id,
        }
        await this.createGame(createGameDto);
        this.removeRoom(data.roomName);
    }

    handleLeaveQueue(userId: UserIdDto) {
        const playerIndex = this.queued.indexOf(userId);
        this.queued.splice(playerIndex, 1);
    }

    handleMove(event: string, id: number, userId: number) {
        let data: GameDto = this.gameRooms.find(game => game.id === id)?.data;
        if (!data) {
            console.log("!Data")
            return ;
        }
        if (data.player1.id === userId) {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, data.player1);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, data.player1);
        }
        else {
            if (event === "ArrowUp")
                this.setVelocity(-0.01, data.player2);
            else if (event === "ArrowDown")
                this.setVelocity(0.01, data.player2);
        }
    }

    handleStopMove(event: string, id: number, userId: number) {
        let data: GameDto = this.gameRooms.find(game => game.id === id)?.data;
        if (!data)
            return ;
        if (data.player1.id === userId) {
            if (event === "ArrowUp")
                this.killVelocity(data.player1);
            else if (event === "ArrowDown")
                this.killVelocity(data.player1);
        }
        else {
            if (event === "ArrowUp")
            this.killVelocity(data.player2);
        else if (event === "ArrowDown")
            this.killVelocity(data.player2);
        }
    }

    async removeRoom(roomName: string) {
        const idx: number = this.gameRooms.findIndex(game => game.roomName === roomName);
        if (idx === -1)
            return ;
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
    async incrPoints(player: PlayerDto) {
        player.points++;
    }

    async setVelocity(val: number, player: PlayerDto){
        player.velocity = val;
    }

    async killVelocity(player: PlayerDto) {
        player.velocity = 0;
    }

    async move(player: PlayerDto) {
        const val: number  = player.y + player.velocity;
        if (player.velocity > 0) {
            if (val + player.h / 2 < 0.99)
                player.y = val;
        }
        else {
            if (val - player.h / 2 > 0.01)
                player.y = val;
        }
    }

    async calculatePlayer(data: GameDto) {
        this.move(data.player1);
        this.move(data.player2);
    }

    /* GamePlay Ball */
    //========== BOUNCES =============//
    async bounce(data: GameDto) {
        this.borderBounce(data.ball);
        this.paddleBounce(data);
        this.score(data);
    };

    //>>BORDER<<//
    async borderBounce(ball: BallDto) {
        if (ball.y - ball.r <= 0 || ball.y + ball.r >= 1)
            ball.speed[1] *= -1;
    }

    //>>PADDLE<//
    async paddleBounce(data: GameDto) {
        if (data.ball.speed[0] < 0)
            this.paddleLeftBounce(data.ball, data.player1);
        else
            this.paddleRightBounce(data.ball, data.player2);
    }
        
    async paddleLeftBounce(ball: BallDto, player: PlayerDto) {
        let dx = Math.abs(ball.x + ball.r - player.x);
        let dy = Math.abs(ball.y - player.y);

        if (dx <= (ball.r + player.w)) {
            if (dy <= (ball.r + player.h / 2)) {
                const coef = 10 * (ball.y - player.y);
                const radian = (coef * player.angle) * (Math.PI / 180);
                ball.speed[0] *= -1;
                ball.speed[1] = Math.sin(radian);
            }
        }
    };
    
    async paddleRightBounce(ball: BallDto, player: PlayerDto) {
        
        let dx = Math.abs(ball.x - ball.r - player.x);
        let dy = Math.abs(ball.y - player.y);

        if (dx <= (ball.r + player.w)) {
            if (dy <= (ball.r + player.h / 2)) {
                const coef = 10 * (ball.y - player.y);
                const radian = (coef * player.angle) * (Math.PI / 180);
                ball.speed[0] *= -1;
                ball.speed[1] = Math.sin(radian);
            }
        }
    };

    //========== SCORE =============//
    async score(data: GameDto) {
        if (data.ball.x <= 0) {
            this.incrPoints(data.player2);
            this.reset(data.ball);
        }
        else if(data.ball.x >= 1) {
            this.incrPoints(data.player1);
            this.reset(data.ball);
        }
    }

    //========== RESET BALL =============//
    async reset(ball: BallDto) {
        ball.x = 0.5;
        ball.y = 0.5;
        let val = 1;
        if (Math.random() < 0.5) {
           val *= -1;
        }
        ball.speed[0] = 0.3 * val;
        ball.speed[1] = Math.random() * val;
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
    async calculateBall(data: GameDto) {
        this.bounce(data);
        this.updateBall(data.ball);
        this.incrementSpeed(data.ball);
    };

    async calculateGame(data: GameDto): Promise<GameDto> {
        this.calculatePlayer(data);
        this.calculateBall(data);
        if (data.player1.points > 11 || data.player2.points > 11)
            data.end = true;
        return data;
    }

    //=================================================//
    //================== UPDATE GAME ==================//
    //=================================================//

    async update(server: Server, data: GameDto) {
        // TODO Check disconnected sockets
        while (!data.end) {
            data = await  this.calculateGame(data);
            server.to(data.roomName).emit('updateGame', data);
            this.sleep(1000 / 60);
        }
    }

    // Todo: put colors in frontend
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
            speed: [0.05, 0.02],
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
