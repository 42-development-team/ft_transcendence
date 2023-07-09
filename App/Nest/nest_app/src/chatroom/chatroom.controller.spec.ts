import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { SocketGateway } from '../sockets/socket.gateway';

describe('ChatroomController', () => {
  let controller: ChatroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatroomController],
      providers: [ChatroomService, PrismaService, SocketGateway],
    }).compile();

    controller = module.get<ChatroomController>(ChatroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
