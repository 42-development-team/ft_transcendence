import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from "../users/users.module";
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [GameController],
  providers: [GameService, PrismaService],
  exports: [GameService]
})
export class GameModule {}