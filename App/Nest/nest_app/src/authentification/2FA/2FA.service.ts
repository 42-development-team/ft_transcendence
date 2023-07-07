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

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async generateTwoFA(username: string) :Promise<String> {
        const secret = authenticator.generateSecret();
        const updateSecret = await this.prisma.user.updateMany({
            where: {
                username: username
            },
            data: {
                twoFAsecret: secret
            },
        });
        console.log('End generatTwoFA');
        return (await this.generateTwoFAQrcode( username, secret ));
    }

    async generateTwoFAQrcode( username: string, secret: string ) : Promise<String> {
        const qrcodeURL = authenticator.keyuri(
            username,
            process.env.AUTH_FACTOR_APP_NAME,
            secret
        );
        const imageUrl = "test";
        qrcode.toDataURL(qrcodeURL, async (err, imageUrl) => {
            if (err) {
                console.log('Error with QR');
                return;
            }
            console.error(imageUrl);
            return ( imageUrl );
        })
        return ;
    }

    async turnOnTwoFA( username: string ) : Promise<String> {
            const updateEnabledTFa = await this.prisma.user.updateMany({
                where: {
                    username: username
                },
                data: {
                    isTwoFAEnabled: true
                },
            });
            return (((await this.generateTwoFA( username ))));
    }

        async isTwoFACodeValid( twoFACode: string, user: User) {
            return authenticator.verify({
                token: twoFACode,
                secret: user.twoFAsecret,
            });
        }
}
