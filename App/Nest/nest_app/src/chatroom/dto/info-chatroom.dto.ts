import { IsNotEmpty, IsString, IsBoolean, IsNumber } from 'class-validator';

export class InfoChatroomDto {
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
}
