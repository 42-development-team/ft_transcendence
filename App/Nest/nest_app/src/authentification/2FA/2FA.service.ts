import { Injectable} from "@nestjs/common";
import { authenticator } from 'otplib';
import {UsersService} from "../../users/users.service";
import { toDataURL } from 'qrcode'; //TODO: find lib
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async generate2FA(username: string) {
        const secret = authenticator.generateSecret();
        await this.prisma.user.update({
            where: {username: username},
            data: {twoFAsecret: secret},
        });
    }

    async generate2FAQrcode( username: string, secret: string ) {
            const qrcodeURL = authenticator.keyuri(
                username,
                process.env.AUTH_FACTOR_APP_NAME,
                secret
            );
            return toDataURL( qrcodeURL );
        }

    async turnOnTwoFA( username: string ) {
            await this.prisma.user.update({
                where: {username: username},
                data: {isTwoFAEnabled: true},
            });
            this.generate2FA( username );
    }

        async isTwoFACodeValid( twoFACode: string, user: User) {
            return authenticator.verify({
                token: twoFACode,
                secret: user.twoFAsecret,
            });
        }
}
