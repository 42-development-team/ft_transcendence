import { Injectable, UnauthorizedException} from "@nestjs/common";
import { authenticator } from 'otplib';
import {UsersService} from "../../users/users.service";
import * as qrcode from 'qrcode'
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";
import { CreateUserDto } from "src/users/dto";
import axios from 'axios';
import { Console } from "console";
import { toDataURL } from "qrcode";
import { plainToClass } from "class-transformer";
import { qrCodeDto } from "../dto/TwoFactor.dto";
import { toFileStream } from 'qrcode';
import { Response } from "express";

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService,
    ) {}

    public async generateTwoFA( username: string ) {
        const secret = authenticator.generateSecret();
        const updateSecret = await this.prisma.user.updateMany({
            where: {
                username: username
            },
            data: {
                twoFAsecret: secret
            },
        });
        const qrcodeURL = authenticator.keyuri(
            username,
            process.env.AUTH_FACTOR_APP_NAME,
            secret
        );
        return qrcodeURL;
    }

    async isTwoFACodeValid( req: Request, res: Response, username: string) {
        const user = await this.prisma.user.findUnique({
            where: {username: username},
        });
        const isValid = authenticator.verify({
            token: req,
            secret: user.twoFAsecret,
        });
        if (isValid) {
            await this.prisma.user.updateMany({
                where: {
                    username: user.username
                },
                data: {
                    isTwoFAEnabled: true
                },
            });
            res.send( isValid );
        }
    }

    async isTwoFAEnabled( res: Response, username: string ) {
        const user = await this.prisma.user.findUnique({
            where: {username: username},
        });
        const isEnabled = user.isTwoFAEnabled;
        res.send(isEnabled);
    }
}
