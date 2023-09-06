import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from "../users/users.module";

//==================
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameGateway } from 'src/sockets/game.gateway';


@Module({
  imports: [UsersModule, JwtModule, PrismaModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService]
})
export class GameModule {}