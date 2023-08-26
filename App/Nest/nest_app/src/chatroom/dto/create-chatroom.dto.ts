import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateChatroomDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['public', 'private', 'protected', 'direct_message'], { message: 'Invalid channel type' })
    type: string;

    @IsOptional()
    @IsString()
    hashedPassword?: string;
    
    @IsOptional()
    @IsString()
    receiverId?: string;
}
