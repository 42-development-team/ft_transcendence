import { IsNotEmpty, IsString, MaxLength, IsBoolean, IsIn, IsArray } from 'class-validator';

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
   avatar?:     string;

   @IsString()
   twoFAsecret: string;

   @IsBoolean()
   isTwoFAEnabled: Boolean;

   @IsBoolean()
   isFirstLogin: Boolean;

   @IsNotEmpty()
   @IsString()
   @IsIn(['online', 'offline', 'in a game'], { message: 'Invalid user status' })
   currentStatus: string;

   @IsArray()
   socketIds: string[];
 }
