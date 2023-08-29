import { Controller, Delete, Get, HttpStatus, Param, Redirect, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Post, Body, Patch } from '@nestjs/common';
import { Response } from 'express';
import { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { DeleteGameDto } from './dto/delete-game.dto';

//===========
import { SocketGateway } from "src/sockets/socket.gateway";
import { UserIdDto } from 'src/userstats/dto/user-id.dto';
import { GetCurrentUserId } from 'src/common/custom-decorators/get-current-user-id.decorator';
import { GameDto, PlayerDto, BallDto } from './dto/game-data.dto';
import { GameRoomDto } from './dto/create-room.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
    constructor(
        private configService: ConfigService,
        private gameService: GameService,
        private userService: UsersService,
        private socketGateway: SocketGateway,
    ) {}
    private queued: UserIdDto[] = [];

    logger = new Logger ('GameController'); // instanciating Lgger class to use it for debugging instead of console.log etc

    /* C(reate) */
    /***
     * create newGame with the first player in matchmaking room, 
     * return newGame
     */
    @Post('create')    
    async create(@Body() createGameDto: CreateGameDto) {
        this.logger.log('Creating a new game');
        const newGame = await this.gameService.createGame(createGameDto);
        this.logger.log(`Successfully created game with ID ${newGame.id}`);
        return newGame;
    }

    @Post('queue')
    async queue(@GetCurrentUserId() userId: number, res: Response) {

        this.queued.push({userId});

        console.log("=======game-controller.ts========")
        console.log(userId + " have joined queue!");
        console.log("queueList:", this.queued);
        // secure if userId 1 and 2 are the same
        if (this.queued.length >= 1) {
            const newGameRoom: GameRoomDto = {
                gameId: 0,
                // roomName: this.queued[0].userId + "_" + this.queued[1].userId,
                roomName: this.queued[0].userId + "_9",
                playerOneId: this.queued[0].userId,
                // playerTwoId: this.queued[1].userId,
                playerTwoId: 9,
                data: this.setGameData(this.queued[0].userId, 9),
                // data: this.setGameData(this.queued[0].userId, this.queued[1].userId),
            }

            // const playerOne = await this.userService.getUserFromId(this.queued[0].userId);
            // const playerTwo = await this.userService.getUserFromId(this.queued[1].userId);

            // this.socketGateway.sendGameData(newGameRoom.roomName, newGameRoom);
            // leave queue
        }
    }

    /* R(ead) */ //with game id
    @Get('info/:id')
    async getGame(@Param('id') id: string) {
        const gameId = parseInt(id);
        this.logger.log('Getting game');
        const game = await this.gameService.getGame(gameId);
        this.logger.log(`Successfully got game with ID ${game.id}`);
        return game;
    }

    @Get('infoGames/:userId')
    async getGames(@Param('userId') userId: string, @Res() res: Response) {
        const id = parseInt(userId);
        this.logger.log('Getting games');
        const games = await this.gameService.getGames(id);
        this.logger.log(`Successfully got games of user with ID ${id}`);
        res.status(HttpStatus.OK).send(games);
    }

    /* U(pdate) */
    @Patch('update')
    async updateGame(@Body() updateGameDto: UpdateGameDto) {
        this.logger.log('Updating game');
        const game = await this.gameService.updateGame(updateGameDto);
        this.logger.log(`Successfully updated game with ID ${game.id}`);
        return game;
    }

    @Patch('join')
    async joinGame(@Body() joinGameDto: JoinGameDto) {
        this.logger.log('Updating game');
        const game = await this.gameService.joinGame(joinGameDto);
        this.logger.log(`Successfully updated game with ID ${game.id}`);
        return game;
    }

    /* D(elete) */
    @Delete('delete')
    async deleteGame(@Body() deleteGameDto: DeleteGameDto) {
        this.logger.log('Deleting game');
        const gameDeleted = await this.gameService.deleteGame(deleteGameDto);
        this.logger.log(`Successfully deleted game with ID ${deleteGameDto.gameId}`);
        return gameDeleted;
    }

    setGameData(playerOneId: number, playerTwoId: number): GameDto{
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
    		speed: [0, 0],
    		incr: 0,
		}

		let data: GameDto = {
			player1: player1,
			player2: player2,
			ball: ball,
		}

        return data;
    }
}