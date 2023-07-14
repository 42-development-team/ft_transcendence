import { TwoFAService } from './2FA.service';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Param, Req, Res, Get, Header, Redirect, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { qrCodeDto } from './TwoFactor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as qrcode from 'qrcode'
import { Public } from 'src/auth/public.routes';

@ApiTags("TwoFA")
@Public()
@Controller('2fa')
export class TwoFAController {
    constructor (private twoFAService: TwoFAService, private prisma: PrismaService) {} //for now, a wrong username is a crash, waiting to know how we get user from next

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

    @Post('/verifyTwoFA/:username')
    async verifyTwoFA (
        @Res() res: Response,
        @Req() req: Request,
        @Body() code : qrCodeDto,
        @Param('username') username: string,
    ) {
        const isValid: boolean = await this.twoFAService.isTwoFACodeValid( code.code, res, username );
        return res.send(isValid);
    }

    // @Post('/verifyTwoFARedirect/:username')
    // async verifyTwoFARedirect (
    //     @Res() res: Response,
    //     @Req() req: Request,
    //     @Body() code : qrCodeDto,
    //     @Param('username') username: string,
    // ) {
    //     const isValid: boolean = await this.twoFAService.isTwoFACodeValid( code.code, res, username );
    //     if (isValid)
    //         res.redirect('http://localhost:3000/home');
    //     else
    //         return res.send(isValid);
    // }

    @Get('/turn-off/:username')
    async turnOffTwoFA (
        @Res() res: Response,
        @Param ('username') username: string,
    ) {
        this.twoFAService.turnOff( username );
    }
}
