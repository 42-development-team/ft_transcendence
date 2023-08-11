import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

// Todo: add avatar
export class ChatroomMemberDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsBoolean()
    isAdmin: boolean;
}
