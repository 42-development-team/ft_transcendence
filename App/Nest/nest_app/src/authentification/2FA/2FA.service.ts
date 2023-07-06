import { Injectable, UnauthorizedException} from "@nestjs/common";
import { authenticator } from 'otplib';
import {UsersService} from "../../users/users.service";
import * as qrcode from 'qrcode'
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";
import { CreateUserDto } from "src/users/dto";
import axios from 'axios';

@Injectable()
export class TwoFAService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async generateTwoFA(username: string) {
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
        this.generateTwoFAQrcode( username, secret );
    }

    async generateTwoFAQrcode( username: string, secret: string ) {
        const qrcodeURL = authenticator.keyuri(
            username,
            process.env.AUTH_FACTOR_APP_NAME,
            secret
        );
        qrcode.toDataURL(qrcodeURL, async (err, imageUrl) => {
            if (err) {
                console.log('Error with QR');
                return;
            }
            console.error(imageUrl);
            return (imageUrl);
        })
    // try {
    //         (await axios.post('http://localhost:3000', { imageUrl: qrcodeURL }));
    //         console.log('Image URL sent successfully');
    //         } catch (error) {
    //         console.error('Error sending image URL:', error.message);
    //         }
        }

    async turnOnTwoFA( username: string ) {
            const updateEnabledTFa = await this.prisma.user.updateMany({
                where: {
                    username: username
                },
                data: {
                    isTwoFAEnabled: true
                },
            });
            this.generateTwoFA( username );
    }

        async isTwoFACodeValid( twoFACode: string, user: User) {
            return authenticator.verify({
                token: twoFACode,
                secret: user.twoFAsecret,
            });
        }
}
