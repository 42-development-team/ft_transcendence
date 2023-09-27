import { Module, forwardRef } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from "../users/users.module";

//==================
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameGateway } from 'src/sockets/game.gateway';
import { UserstatsController } from 'src/userstats/userstats.controller';
import { UserstatsModule } from 'src/userstats/userstats.module';


@Module({
  imports: [UsersModule, JwtModule, PrismaModule, UserstatsModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService]
})
export class GameModule {}