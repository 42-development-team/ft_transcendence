import { Test, TestingModule } from '@nestjs/testing';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../prisma/prisma.service';


describe('ChatroomService', () => {
  let service: ChatroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatroomService, PrismaService],
    }).compile();

    service = module.get<ChatroomService>(ChatroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
