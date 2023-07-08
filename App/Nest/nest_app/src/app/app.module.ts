import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatroomController } from 'src/chatroom/chatroom.controller';
import { ChatroomService } from 'src/chatroom/chatroom.service';
<<<<<<< HEAD
import { SocketModule } from '@nestjs/platform-socket.io';


@Module({
  imports: [SocketModule],
=======

@Module({
  imports: [],
>>>>>>> FT-86-implement-backend-logic-to-creating-chat-rooms-managing-participants-and-joining-rooms
  controllers: [AppController, UsersController, ChatroomController],
  providers: [AppService, UsersService, ChatroomService, PrismaService],
})
export class AppModule {}
