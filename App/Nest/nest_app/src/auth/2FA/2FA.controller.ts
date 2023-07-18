import { TwoFAService } from './2FA.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Param, Req, Res, Get, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { qrCodeDto } from './TwoFactor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
        private prisma: PrismaService,
    ) {} //for now, a wrong username is a crash, waiting to know how we get user from next

    @Get('/turn-on/:username')
    async turnOnTwoFa (
        @Res() res: Response,
        @Param ('username') username: string,
        ) {
        const qrCodeUrl = await this.twoFAService.generateTwoFA(username);
        const base64Qrcode = await qrcode.toDataURL(qrCodeUrl);
        res.send({
			contentType: 'image/png',
			base64Qrcode,
		});
    }
    
    @Get('/isTwoFAActive/:username')
    async isActive (
        @Param ('username') username: string,
        @Res() res: Response,
    ) {
        await this.twoFAService.isTwoFAEnabled( res, username );
    }

    @Public()
    @Get('/TwoFAAuthRedirect/')
    async TwoFAAuthRedirect (
        @Res() res: Response,
    ) : Promise<any> {
        res.redirect(`http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}/firstLogin`);
    }

    @Post('/verifyTwoFA/:username')
    async verifyTwoFA (
        @Res() res: Response,
        @Body() code : qrCodeDto,
        @Param('username') username: string,
    ) {
        const isValid: boolean = await this.twoFAService.isTwoFACodeValid( code.code, res, username );
        return res.send(isValid);
    }

    @Delete('/turn-off/:username')
    async turnOffTwoFA (
        @Res() res: Response,
        @Param ('username') username: string,
    ) {
        this.twoFAService.turnOff( username );
    }
}
