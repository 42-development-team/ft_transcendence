import { IsNotEmpty, IsString, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { CreateMembershipDto } from 'src/membership/dto/create-membership.dto';
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

    @IsArray()
    bannedUsers: ChatroomMemberDto[];

    @IsNotEmpty()
    @IsNumber()
    ownerId: number;
}
