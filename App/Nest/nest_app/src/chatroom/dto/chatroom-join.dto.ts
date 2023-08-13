import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChatroomDto } from './create-chatroom.dto';

export class JoinRequestDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateChatroomDto)
    newChannelInfo: CreateChatroomDto;
}
