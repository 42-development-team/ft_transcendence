import { IsNotEmpty, IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateUsernameDto {
    @IsNotEmpty()
    @IsString()
    username:   string;
}

export class UpdateEmailDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email:   string;
}