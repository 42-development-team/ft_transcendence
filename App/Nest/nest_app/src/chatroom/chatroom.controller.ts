import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { User } from '@prisma/client'
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'

@ApiTags('ChatRoom') 
@Controller('chatroom')
export class ChatroomController {
  constructor(
    private chatroomService: ChatroomService,
    private socketGateway: SocketGateway,
    ) {}

  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any) {
    const user: User = req.user;

    createChatroomDto.owner = user.id; 
    createChatroomDto.admins = [user.id];

    const newChatRoom = this.chatroomService.createChatRoom(createChatroomDto, user.id);

    this.socketGateway.server.emit("NewChatRoom", newChatRoom);
    return newChatRoom;
  }


  @Get()
  findAll() {
    return this.chatroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatroomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto) {
    return this.chatroomService.update(+id, updateChatroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomService.remove(+id);
  }
}
