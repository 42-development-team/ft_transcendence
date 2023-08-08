import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { User } from '@prisma/client'
import { SocketGateway } from '../sockets/socket.gateway';
import { ApiTags } from '@nestjs/swagger'
import { InfoChatroomDto } from './dto/info-chatroom.dto';

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
  async findAll(@Request() req: any): Promise<InfoChatroomDto[]> {
    const userId: number = req.user.sub;
    return this.chatroomService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any): Promise<InfoChatroomDto> {
    const userId: number = req.user.sub;
    return this.chatroomService.findOne(+id, userId);
  }

  /* U(pdate) */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatroomDto: UpdateChatroomDto) {
    return this.chatroomService.update(+id, updateChatroomDto);
  }

  @Patch(':id/join')
  join(@Param('id') id: string, @Request() req: any) {
    const userId: number = req.user.sub;
    const joinedChatRoom = this.chatroomService.join(+id, userId);
    // Todo: emit event on socket to join the channel
    return joinedChatRoom;
  }

  /* D(elete) */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomService.remove(+id);
  }
}
