import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Post, Body, Request, Patch } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';

@ApiTags('Game')
@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

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

    /* R(ead) */
    @Get('info')
    async getGame(@Request() req: any) {
        this.logger.log('Getting game');
        const userId: number = req.user.sub;
        const game = await this.gameService.getGame(userId);
        this.logger.log(`Successfully got game with ID ${game.id}`);
        return game;
    }

    /* U(pdate) */
    @Patch('update')
    async updateGame(@Body() updateGameDto: UpdateGameDto) {
        this.logger.log('Updating game');
        const game = await this.gameService.updateGame(updateGameDto);
        this.logger.log(`Successfully updated game with ID ${game.id}`);
        return game;
    }

    // @Patch('join')
    // async joinGame(@Body() joinGameDto: JoinGameDto)) {
    //     this.logger.log('Updating game');
    //     const game = await this.gameService.updateGame();
    //     this.logger.log(`Successfully updated game with ID ${game.id}`);
    //     return game;
    // }
}