import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail,IsNumber, MaxLength } from 'class-validator';
import { isStrongPassword } from 'custom_decorators/isStrongPassword.decorators';

export class UpdateUsernameDto {
    @IsNotEmpty()
    @IsString()
    username:   string;
}

export class UpdateEmailDto {
    @IsNotEmpty()
    @IsString()
    email:      string;
}