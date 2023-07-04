import { IsNotEmpty, IsString } from "class-validator";

export class TwoFactorUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    twoFAsecret: string;
}