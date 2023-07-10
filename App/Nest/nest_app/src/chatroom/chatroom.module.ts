import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService]
})
export class ChatroomModule {}
