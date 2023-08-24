import { IsNotEmpty, IsString, IsIn, IsOptional, IsArray } from 'class-validator';

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
    hashedPassword?: string;
}
