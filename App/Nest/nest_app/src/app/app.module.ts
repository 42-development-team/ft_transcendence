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
import { FirstLoginController } from 'src/auth/firstLogin/firstLogin.controller';
import { TwoFAModule } from 'src/auth/2FA/2FA.module';
import { FirstLoginModule } from 'src/auth/firstLogin/firstLogin.module';
import { FirstLoginService } from 'src/auth/firstLogin/firstLogin.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
  }),
  UsersModule, PrismaModule, AuthModule, TwoFAModule, FirstLoginModule],
  controllers: [AppController, UsersController, ChatroomController,TwoFAController, FirstLoginController],
  providers: [AppService, UsersService, ChatroomService, PrismaService, SocketGateway,TwoFAService, FirstLoginService],
})
export class AppModule {}
