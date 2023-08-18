import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { GameService } from './game.service';

@ApiTags('Game')
@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {}

    logger = new Logger ('UsersController'); // instanciating Lgger class to use it for debugging instead of console.log etc

    /* C(reate) */
    @Post() // create newGame with the two PlayerId, return newGame then each player know they are connected to
    async create(@Body() createGameDto: CreateGameDto) {
        this.logger.log('Creating a new game');
        const newGame = await this.gameService.createGame(createGameDto);
        this.logger.log(`Successfully created game with ID ${newGame.id}`);
        return newGame;
    }
}