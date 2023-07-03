import { TwoFactorDto } from '../dto/TwoFactor.dto';
import { ApiTags } from '@nestjs/swagger';
import {Controller, UseGuards} from "@nestjs/common";
import { Controller, Post } from '@nestjs/common';

@ApiTags("twoFA")
@Controller('/2fa')
export class TwoFAController {
    constructor (private twoFAService: twoFactorAuthService) {}

    @Post('generate')
    async generate2Fa(
        @GetCurrentUser('username') username: string,
    ) {
        const qrcodeUrl = await this.twoFAService.generate2FA(username)
    }

    // @Post('turn-on') ==> TODO: enable or disable 2FA
    // @Post('turn-off')
}
