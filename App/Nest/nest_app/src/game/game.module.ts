import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersModule } from "../users/users.module";

//==================
import { SocketGateway } from 'src/sockets/socket.gateway';
import { MembershipService } from 'src/membership/membership.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [UsersModule, ChatroomModule, JwtModule, PrismaModule],
  controllers: [GameController],
  providers: [GameService, SocketGateway, MembershipService],
  exports: [GameService, SocketGateway]
})
export class GameModule {}