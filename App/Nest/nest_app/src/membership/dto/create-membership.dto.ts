import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateMembershipDto {
    @IsNotEmpty()
    user: number;

    @IsNotEmpty()
    chatroom: number;

    @IsBoolean()
    isAdministrator: boolean;
}
