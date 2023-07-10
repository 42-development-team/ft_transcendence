import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { ChatRoom } from '@prisma/client';
import { User } from '@prisma/client';
import { plainToClass } from 'class-transformer';


@Injectable()
export class ChatroomService {
  constructor(
    private prisma: PrismaService,
) {}

    /* C(reate) */

  async createChatRoom(createChatroomDto: CreateChatroomDto, ownerId: number) {
    const { name, type, password } = createChatroomDto;

    const createdChatroom = await this.prisma.chatRoom.create({
      data: {
        name,
        type,
        password,
        owner: { connect: { id: ownerId } },
        admins: { connect: [{ id: ownerId }] },
      },
    });

    return createdChatroom;
  }

  findAll() {
    return `This action returns all chatroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatroom`;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
