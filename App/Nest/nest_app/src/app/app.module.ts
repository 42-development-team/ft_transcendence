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
import { TwoFAController } from '../auth/2FA/2FA.controller';
import { TwoFAService } from '../auth/2FA/2FA.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from '../config/config';
import { TwoFAModule } from '../auth/2FA/2FA.module';
import { AvatarsController } from '../avatars/avatars.controller';
import { CloudinaryService } from '../avatars/cloudinary.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatroomModule } from '../chatroom/chatroom.module';
import { GameModule } from 'src/game/game.module';
import { UserstatsModule } from '../userstats/userstats.module';
import { GameController } from 'src/game/game.controller';
import { GameService } from 'src/game/game.service';
import { UserStatsService } from '../userstats/userstats.service';
import { UserstatsController } from '../userstats/userstats.controller';
import { FriendModule } from 'src/friend/friend.module';
import { FriendController } from 'src/friend/friend.controller';

//=============
// import { SocketGateway } from '../sockets/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    TwoFAModule,
    ChatroomModule,
    GameModule,
    UserstatsModule,
    FriendModule,
    JwtModule.registerAsync({
      inject: [ConfigService], // Inject ConfigService to access JWT_SECRET
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'), 
        signOptions: { expiresIn: '1d' }, 
      }),
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    ChatroomController,
    TwoFAController,
    AvatarsController,
    GameController,
    UserstatsController,
    FriendController
  ],
  providers: [
    AppService,
    UsersService,
    ChatroomService,
    PrismaService,
    TwoFAService,
    CloudinaryService,
    GameService,
    UserStatsService,
    // SocketGateway,
  ],
})
export class AppModule {}
