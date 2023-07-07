import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
 
 export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login:      string;

  @IsNotEmpty()
  @IsString()
  username:   string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(65_000)
  avatar:     string;
 }