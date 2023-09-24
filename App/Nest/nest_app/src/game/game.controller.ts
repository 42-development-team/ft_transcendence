import { Controller, Delete, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Body, Patch } from '@nestjs/common';
import { Response } from 'express';
import { GameService } from './game.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { DeleteGameDto } from './dto/delete-game.dto';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService,
    ) {}

    logger = new Logger ('GameController');

    /* C(reate) */

    /* R(ead) */ //with game id
    @Get('info/:id')
    async getGame(@Param('id') id: string) {
        const gameId = parseInt(id);
        const game = await this.gameService.getGame(gameId);
        this.logger.log(`Successfully got game with ID ${game.id}`);
        return game;
    }

    @Get('infoGames/:userId')
    async getGames(@Param('userId') userId: string, @Res() res: Response) {
        const id = parseInt(userId);
        const games = await this.gameService.getGames(id);
        this.logger.log(`Successfully got games of user with ID ${id}`);
        res.status(HttpStatus.OK).send(games);
    }

    /* U(pdate) */
    @Patch('update')
    async updateGame(@Body() updateGameDto: UpdateGameDto) {
        const game = await this.gameService.updateGame(updateGameDto);
        this.logger.log(`Successfully updated game with ID ${game.id}`);
        return game;
    }

    @Patch('join')
    async joinGame(@Body() joinGameDto: JoinGameDto) {
        const game = await this.gameService.joinGame(joinGameDto);
        this.logger.log(`Successfully updated game with ID ${game.id}`);
        return game;
    }

    /* D(elete) */
    @Delete('delete')
    async deleteGame(@Body() deleteGameDto: DeleteGameDto) {
        const gameDeleted = await this.gameService.deleteGame(deleteGameDto);
        this.logger.log(`Successfully deleted game with ID ${deleteGameDto.gameId}`);
        return gameDeleted;
    }
}
