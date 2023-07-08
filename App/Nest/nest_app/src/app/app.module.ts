import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatroomController } from 'src/chatroom/chatroom.controller';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { SocketModule } from '@nestjs/platform-socket.io';


@Module({
  imports: [UsersModule, PrismaModule, AuthModule, SocketModule],
  controllers: [AppController, UsersController, ChatroomController],
  providers: [AppService, UsersService, ChatroomService, PrismaService],
})
export class AppModule {}
