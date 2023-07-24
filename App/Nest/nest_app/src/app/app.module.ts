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
import { TwoFAController } from 'src/auth/2FA/2FA.controller';
import { TwoFAService } from 'src/auth/2FA/2FA.service';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config/config';
import { TwoFAModule } from 'src/auth/2FA/2FA.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  UsersModule, PrismaModule, AuthModule, TwoFAModule],
  controllers: [AppController, UsersController, ChatroomController,TwoFAController],
  providers: [AppService, UsersService, ChatroomService, PrismaService, SocketGateway,TwoFAService ],
})
export class AppModule {}
