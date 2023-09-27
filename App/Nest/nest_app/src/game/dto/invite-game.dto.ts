import { IsNotEmpty, IsNumber, isBoolean, isNotEmpty } from "class-validator";

export class InviteDto {

    @IsNotEmpty()
    @IsNumber()
    invitorId: number;

    @IsNotEmpty()
    @IsNumber()
    invitedId: number;

    mode: boolean;
}
