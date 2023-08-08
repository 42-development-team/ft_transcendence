import { IsNotEmpty, IsString, IsIn, IsBoolean, IsNumber } from 'class-validator';

export class InfoChatroomDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['public', 'private', 'protected'], { message: 'Invalid channel type' })
    type: string;

    @IsNotEmpty()
    @IsBoolean()
    joined: boolean;
}
