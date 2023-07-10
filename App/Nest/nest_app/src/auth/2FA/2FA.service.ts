import { Injectable, UnauthorizedException} from "@nestjs/common";
import { authenticator } from 'otplib';
import {PrismaService} from "../../prisma/prisma.service";
import { Response } from "express";

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async generateTwoFA( username: string ) {
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

    async isTwoFACodeValid( code: string, res: Response, username: string) {
        console.log("code:" + code + ", reponse:" + res + ", username:" + username);
        const user = await this.prisma.user.findUnique({
            where: {username: username},
        });
        const isValid = authenticator.verify({
            token: code,
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
        }
        return isValid;
    }

    async isTwoFAEnabled( res: Response, username: string ) {
        const user = await this.prisma.user.findUnique({
            where: {username: username},
        });
        const isEnabled = user.isTwoFAEnabled;
        res.send(isEnabled);
    }

    async turnOff( username :string ) {
        await this.prisma.user.updateMany ({
            where: {
                username: username
            },
            data: {
                isTwoFAEnabled: false,
                twoFAsecret: "",
            },
        });
    }
}
