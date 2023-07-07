// import { TwoFactorUserDto } from '../dto/';
import { TwoFAService } from './2FA.service';
import { ApiTags } from '@nestjs/swagger';
import {HttpStatus, Put, UseGuards} from "@nestjs/common";
import { Controller, Post, Body, Param, Req, Res, Get, Header, Redirect } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto';
import { stringify } from 'querystring';
import { HttpCode } from '@nestjs/common';
import { Http2ServerResponse } from 'http2';
import { qrCodeDto } from '../dto/TwoFactor.dto';
import * as qrcode from 'qrcode'

@ApiTags("TwoFA")
@Controller('2fa')
export class TwoFAController {
    constructor (private twoFAService: TwoFAService) {}

    @Get('/turn-on/:username')
    async turnOnTwoFa (
        @Res() res: Response,
        @Param ('username') username: string,
        ) {
        const qrCodeUrl = await this.twoFAService.generateTwoFA(username); // change username to User module, receive in Request (how)
        const base64Qrcode = await qrcode.toDataURL(qrCodeUrl);
        res.send({
			contentType: 'image/png',
			base64Qrcode,
		});
    }
    
    // @Get('/verify/:username')
    // async verifyTwoFA (
    //     @Res() res: Response,
    //     @Req() req: Request,
    //     @Param('username') username: string,
    // ) {
    //     return (this.twoFAService.isTwoFACodeValid( req.code, req.user ));
    // }
    // @Post('auth') ==> TODO: auth signin + disable
    // @Post('turn-off')
}
