import { PrismaService } from "src/prisma/prisma.service";
import { CreateGameDto } from "./dto/create-game.dto";

export class GameService {
    constructor(private prisma: PrismaService) {}

    async createGame(createGameDto: CreateGameDto) {
        
        const newGame = await this.prisma.game.create({
            data: {
                users: {
                    connect: [
                        { id: createGameDto.playerOneId },
                        { id: createGameDto.playerTwoId },
                    ],
                },
            },
        });

        return newGame;
    }
}