import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class ChatroomMemberDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    avatar: string;

    @IsNotEmpty()
    @IsBoolean()
    isAdmin: boolean;
}
