import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Injectable } from "@nestjs/common";
import { BallDto, GameDto, PlayerDto } from "./dto/game-data.dto";
import { GameUserDto } from "./dto/game-user.dto";
import { GetGameDto } from "./dto/get-game.dto";

//===========

@Injectable()
export class GameService {
    constructor(
        private prisma: PrismaService,
        // private socketGateway: SocketGateway,
    ) {}

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
        return data;
    }

    //=================================================//
    //================== UPDATE GAME ==================//
    //=================================================//

    async update(data: GameDto) {
        // TODO Check disconnected sockets
        while (data.player1.points < 11 && data.player2.points < 11) {
            data = await  this.calculateGame(data);
            // this.socketGateway.sendGameData(data.roomName, data);
            const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
            sleep(1/60);
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
            player1: player1,
            player2: player2,
            ball: ball,
        }

        return data;
    }
}
