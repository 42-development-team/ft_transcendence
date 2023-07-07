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

@ApiTags("TwoFA")
@Controller('2fa')
export class TwoFAController {
    constructor (private twoFAService: TwoFAService) {}

    @Get('/turn-on/:username')
    // @HttpCode(204)
    // @Redirect('http://localhost:4000/2fa/turn-on/dburain', 450)
    async turnOnTwoFa (
        @Body() qrCodeUrl: qrCodeDto,
        @Req() req: Request,
        @Res() res: Response,
        @Param ('username') username: string,
        )  : Promise<String> {
        const data = await this.twoFAService.turnOnTwoFA( username );
        // res.send('Created');
        console.log(data)
        res.send(data);
        return data;
    }
    // @Post('auth') ==> TODO: auth signin + disable
    // @Post('turn-off')
}
