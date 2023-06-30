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
    @IsNumber()
    id:         number;
 
    @IsNotEmpty()
    @IsString()
    username:   string;
 
    @IsNotEmpty()
    @IsString()
    email:      string;
 
    @IsNotEmpty()
    @IsString()
    @MaxLength(65_000) //This can help enforce constraints and ensure that the uploaded file path or URL doesn't inadvertently exceed a reasonable length.
    avatar:     string;
 
    // @Exclude()  // Is it really necessary?
    @isStrongPassword() // Custome Decorator to manage password property
    password:   string;
}