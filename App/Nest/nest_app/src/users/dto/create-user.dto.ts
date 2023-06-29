import { Exclude } from 'class-transformer';
/* By using @Exclude(), sensitive data is not included when converting the UserDto instance 
to plain objects or JSON.
This helps protect sensitive information from unintentional exposure or transmission. */
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import {isStrongPassword} from "../../../custom_decorators/isStrongPassword.decorators";
 
 export class CreateUserDto {
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

   // @Exclude()
   @isStrongPassword()
   password:   string;
 }