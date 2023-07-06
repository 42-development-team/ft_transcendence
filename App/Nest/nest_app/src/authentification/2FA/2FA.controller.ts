// import { TwoFactorUserDto } from '../dto/';
import { TwoFAService } from './2FA.service';
import { ApiTags } from '@nestjs/swagger';
import {UseGuards} from "@nestjs/common";
import { Controller, Post, Body, Param, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@ApiTags("TwoFA")
@Controller('2fa')
export class TwoFAController {
    constructor (private twoFAService: TwoFAService) {}

    @Post('/turn-on/:username')
    async turnOnTwoFa(
        @Param ('username') username: string,
        ) {
        this.twoFAService.turnOnTwoFA( username );
    }
    // @Post('auth') ==> TODO: auth signin + disable
    // @Post('turn-off')
}
