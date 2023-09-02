import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class ChatroomInfoDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsBoolean()
    joined: boolean;
    
    @IsNotEmpty()
    @IsBoolean()
    banned: boolean;
}
