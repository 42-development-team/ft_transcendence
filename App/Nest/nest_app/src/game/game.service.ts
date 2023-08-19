import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";
import { UpdateGameDto } from "./dto/update-game.dto";
import { JoinGameDto } from "./dto/join-game.dto";

export class GameService {
    constructor(private prisma: PrismaService) {}

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

    async getGame(id: number) {
        const game = await this.prisma.game.findUniqueOrThrow({
            where: { id: id },
        });
        return game;
    }

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
}