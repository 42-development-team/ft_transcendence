import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatroomController } from '../chatroom/chatroom.controller';
import { ChatroomService } from '../chatroom/chatroom.service';
import { SocketGateway } from '../sockets/socket.gateway';



@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [AppController, UsersController, ChatroomController],
  providers: [AppService, UsersService, ChatroomService, PrismaService, SocketGateway],
})
export class AppModule {}
