import { IsNotEmpty, IsString, IsNumber, IsArray, isBoolean, IsBoolean } from 'class-validator';
import { ChatroomMemberDto } from './chatroom-member.dto';
import { ChatroomMessageDto } from './chatroom-messages.dto';

export class ChatroomContentDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsArray()
    messages: ChatroomMessageDto[];

    @IsArray()
    members: ChatroomMemberDto[];

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;

    @IsBoolean()
    isJoined: boolean;

    @IsBoolean()
    isBanned: boolean;
}
