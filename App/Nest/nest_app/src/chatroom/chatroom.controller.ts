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


  /* C(reate) */
  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto, @Request() req: any) {
    const user: User = req.user;

    createChatroomDto.owner = user.id; 
    createChatroomDto.admins = [user.id];

    const newChatRoom = this.chatroomService.createChatRoom(createChatroomDto, user.id);

    this.socketGateway.server.emit("NewChatRoom", newChatRoom);
    return newChatRoom;
  }

  /* R(ead) */
  @Get()
  async findAll(): Promise<CreateChatroomDto[]> {
    return this.chatroomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateChatroomDto> {
    return this.chatroomService.findOne(+id);
  }

  /* U(pdate) */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto) {
    return this.chatroomService.update(+id, updateChatroomDto);
  }

  /* D(elete) */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomService.remove(+id);
  }
}
