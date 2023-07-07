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
        const updateEnabledTFa = await this.prisma.user.updateMany({
            where: {
                username: username
            },
            data: {
                isTwoFAEnabled: true
            },
        });
        return qrcodeURL;
    }

        async isTwoFACodeValid( twoFACode: string, user: User) {
            return authenticator.verify({
                token: twoFACode,
                secret: user.twoFAsecret,
            });
        }
}
