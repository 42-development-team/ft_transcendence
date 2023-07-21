import { TwoFAService } from './2FA.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Param, Res, Get, Delete, Put } from '@nestjs/common';
import { Response } from 'express';
import { TwoFADto } from './dto/TwoFactor.dto';
import * as qrcode from 'qrcode'
import { Public } from 'src/auth/public.routes';
import { ConfigService } from '@nestjs/config';

@ApiTags("TwoFA")
@Public()
@Controller('2fa')
export class TwoFAController {
    constructor (
        private configService: ConfigService,
        private twoFAService: TwoFAService,
    ) {}

    @Put('/turn-on/')
    async turnOnTwoFa (
        @Res() res: Response,
        @Body() twoFADto: TwoFADto,
    ) {
        const qrCodeUrl = await this.twoFAService.generateTwoFA(Number(twoFADto.userId));
        const base64Qrcode = await qrcode.toDataURL(qrCodeUrl);
        res.send({
            contentType: 'image/png',
            base64Qrcode,
        });
    }
    
    @Get('/isTwoFAActive/:userId')
    async isActive (
        @Param ('userId') userId: string,
        @Res() res: Response,
    ) {
        await this.twoFAService.isTwoFAEnabled( res, Number(userId) );
    }

    @Get('/TwoFAAuthRedirect/')
    async TwoFAAuthRedirect (
        @Res() res: Response,
    ) : Promise<any> {
        res.redirect(`http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}/firstLogin`);
    }

    @Put('/verifyTwoFA/')
    async verifyTwoFA (
        @Res() res: Response,
        @Body() twoFADto : TwoFADto,
    ) {
        const isValid: boolean = await this.twoFAService.isTwoFACodeValid( twoFADto.code, Number(twoFADto.userId) );
        return res.send(isValid);
    }

    @Delete('/turn-off/')
    async turnOffTwoFA (
        @Body() twoFADto: TwoFADto,
    ) {
        const userIdNumber = Number(twoFADto.userId);
        await this.twoFAService.turnOff( userIdNumber );
    }
}
