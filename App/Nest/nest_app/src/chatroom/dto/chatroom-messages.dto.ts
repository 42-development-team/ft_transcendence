import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class ChatroomMessageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsDate()
    createdAt: Date;

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
