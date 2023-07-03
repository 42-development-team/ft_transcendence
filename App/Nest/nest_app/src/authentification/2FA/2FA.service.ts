import { Injectable} from "@nestjs/common";
import { authenticator } from 'otplib';
import {UsersService} from "../../users/users.service";
import { toDataURL } from 'qrcode'; //TODO: find lib
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";

@Injectable()
export class TwoFactorAuthService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    async generate2FA(username: string) {
        const secret = authenticator.generateSecret();
        const qrcodeURL = authenticator.keyuri(
            username,
            process.env.AUTH_FACTOR_APP_NAME,
            secret
        );
        await this.prisma.user.update({
            where: {username: username},
            data: {twoFAsecret: secret},
        });
        return {
            secret,
            qrcodeURL,
        };
    }

        async generate2FAQrcode( qrcodeURL: string ) {
            return toDataURL( qrcodeURL );
        }

        async turnOnTwoFA( username: string ) {
            this.user.update({
                where: {username: username},
                data: {isTwoFAEnabled: true},
            })
        }

        async isTwoFACodeValid( twoFACode: string, user: User) {
            return authenticator.verify({
                token: twoFACode,
                secret: User.secret,
            });
        }
}
