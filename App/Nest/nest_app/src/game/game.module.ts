import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from "../users/users.module";

//==================
import { MembershipService } from 'src/membership/membership.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatroomService } from 'src/chatroom/chatroom.service';


@Module({
  imports: [UsersModule, ChatroomModule, JwtModule, PrismaModule],
  controllers: [GameController],
  providers: [GameService, MembershipService, ChatroomService],
  exports: [GameService]
})
export class GameModule {}