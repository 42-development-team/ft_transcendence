import { Module } from '@nestjs/common';
import { UserStats } from 'seeds/seeds_userstats';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UserstatsController } from './userstats.controller';
import { UserStatsService } from './userstats.service';

@Module({
	  imports: [UsersModule],
	  controllers: [UserstatsController],
	  providers: [UserStatsService, PrismaService],
	  exports: [UserStatsService]
})

export class UserstatsModule {}