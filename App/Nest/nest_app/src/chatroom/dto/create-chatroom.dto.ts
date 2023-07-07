import { IsNotEmpty, IsString, IsNumber, IsIn, IsOptional } from 'class-validator';

export class CreateChatroomDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['public', 'private', 'protected'], { message: 'Invalid channel type' })
    type: string;

    @IsOptional()
    @IsString()
    password?: string;
}
