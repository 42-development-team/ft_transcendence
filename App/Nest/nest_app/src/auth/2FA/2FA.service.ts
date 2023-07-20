import { Injectable, UnauthorizedException} from "@nestjs/common";
import { authenticator } from 'otplib';
import {PrismaService} from "../../prisma/prisma.service";
import { Response } from "express";
import { UsersService } from "../../users/users.service";

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService, private userService: UsersService
    ) {}

    async updateTwoFASecret( userId: number, secret: string ) {
        try {
            const updateSecret = await this.prisma.user.updateMany({
                where: {
                    id: userId
                },
                data: {
                    twoFAsecret: secret
                },
            });
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async generateTwoFA( userId: number ) {
        try {
            const secret = authenticator.generateSecret();
            await this.updateTwoFASecret(userId, secret);
            const qrcodeURL = authenticator.keyuri(
                userId.toString(),
                process.env.AUTH_FACTOR_APP_NAME,
                secret
            );
            return qrcodeURL;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async isTwoFACodeValid( code: string, userId: number) {
        const user = await this.userService.getUserFromId(userId);
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

    async isTwoFAEnabled( res: Response, userId: number ) {
        try {
            const user = await this.userService.getUserFromId(userId);
            const isEnabled = user.isTwoFAEnabled;
            res.send(isEnabled);
        } catch (error) {
            throw new UnauthorizedException();
        }

    }

    async turnOff( userId :number ) {
        try {
            await this.updateTwoFASecret(userId, null);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
