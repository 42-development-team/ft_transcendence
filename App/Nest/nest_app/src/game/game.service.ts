import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";
import { Injectable } from "@nestjs/common";
@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    /* C(reate) */
    async createGame(createGameDto: CreateGameDto) {
        
        const newGame = await this.prisma.game.create({
            data: {
                users: {
                    connect: [
                        { id: createGameDto.playerOneId },
                    ],
                },
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


    async getGames(userId: number) {
        const games = await this.prisma.game.findMany({
            orderBy: { createdAt: 'desc' },
            include: { loser: true, winner: true },
            where: { users: { some: { id: userId } } },
        });
        return games;
    }

    /* U(pdate) */ //TODO: gameDuration
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

}