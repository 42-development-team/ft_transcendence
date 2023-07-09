import { IsNotEmpty, IsString, MaxLength, IsBoolean } from 'class-validator';
 
 export class CreateUserDto {
   @IsNotEmpty()
   @IsString()
   login:      string;

   @IsNotEmpty()
   @IsString()
   username?:   string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(65_000) //This can help enforce constraints and ensure that the uploaded file path or URL doesn't inadvertently exceed a reasonable length.
   avatar:     string;

   @IsString()
   twoFAsecret: string;
   
   @IsBoolean()
   isTwoFAEnabled: Boolean;
   @MaxLength(65_000) 
   avatar?:     string;
 }