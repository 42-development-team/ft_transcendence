import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { SocketGateway } from '../sockets/socket.gateway';

@Module({
  imports: [UsersModule],
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService, JwtService, SocketGateway],
  exports: [ChatroomService, SocketGateway]
})
export class ChatroomModule {}
