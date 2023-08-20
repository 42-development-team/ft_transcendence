import { IsNotEmpty } from 'class-validator';

export class CreateMembershipDto {
    @IsNotEmpty()
    user: number;

    @IsNotEmpty()
    chatroom: number;
}
