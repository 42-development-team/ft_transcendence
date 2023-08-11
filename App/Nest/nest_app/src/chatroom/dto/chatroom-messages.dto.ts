import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ChatroomMessageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    senderId: number;

    @IsNotEmpty()
    @IsString()
    senderUsername: string;
}
