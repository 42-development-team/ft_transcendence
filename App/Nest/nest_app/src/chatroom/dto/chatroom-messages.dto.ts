import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { ChatroomMemberDto } from './chatroom-member.dto';

export class ChatroomMessageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    sender: ChatroomMemberDto;
}
