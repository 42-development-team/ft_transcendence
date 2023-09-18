import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UserstatsController } from './userstats.controller';
import { UserStatsService } from './userstats.service';
import { GameModule } from 'src/game/game.module';

@Module({
	  imports: [UsersModule, forwardRef(() => GameModule)],
	  controllers: [UserstatsController],
	  providers: [UserStatsService, PrismaService],
	  exports: [UserStatsService]
})

export class UserstatsModule {}