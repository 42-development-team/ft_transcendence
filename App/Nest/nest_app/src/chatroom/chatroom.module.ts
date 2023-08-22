import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { SocketGateway } from '../sockets/socket.gateway';
import { MembershipService } from 'src/membership/membership.service';

@Module({
  imports: [UsersModule],
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService, JwtService, SocketGateway, MembershipService],
  exports: [ChatroomService, SocketGateway, JwtService, MembershipService]
})
export class ChatroomModule {}
