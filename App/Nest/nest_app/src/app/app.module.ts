import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TwoFAController } from 'src/authentification/2FA/2FA.controller';
import { TwoFAService } from 'src/authentification/2FA/2FA.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, TwoFAController],
  providers: [AppService, UsersService, PrismaService, TwoFAService],
})
export class AppModule {}
