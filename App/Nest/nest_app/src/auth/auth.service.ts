import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './types/jwtPayload.type';
import { Tokens } from './types/token.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async redirectTwoFA(req: any, res: Response) {
        const frontUrl = `http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}` as string;

        try {
            const userDB = await this.usersService.getUserFromLogin(req.user.login);
            var jwt = await this.getTokens(userDB, false);
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false,
                httpOnly: true,
                SameSite: 'None',
            }

            if (userDB.isFirstLogin) {
                res.status(200)
                    .cookie("jwt", jwt.access_token, cookieOptions)
                    .redirect(`${frontUrl}/firstLogin/`);
            }
            else if (userDB.isTwoFAEnabled) {
                res.status(200)
                    .cookie("jwt", jwt.access_token, cookieOptions)
                    .redirect(`${frontUrl}/auth/2fa`);
            }
            else {
                jwt = await this.getTokens(userDB, true);
                res.status(200)
                    .cookie("jwt", jwt.access_token, cookieOptions)
                    .redirect(`${frontUrl}/home/`);
            }
        } catch (error) {
            throw new Error('Redirect error');
        }
    }

    async changeLoginBooleanStatus(userId: number) {
			await this.prisma.user.updateMany({
				where: { id: userId },
                data: { isFirstLogin: false },
            });
    }

    async updateCurrentStatus(user: any, userId: number, status: string) {
            await this.prisma.user.update({
                where: { id: userId},
                data: { currentStatus: status },
            });
    }

    async logout(res: Response): Promise<void> {
        res.clearCookie('jwt', {sameSite: "lax"});
        return;
    }

    async getTokens(user: any, twoFactorAuthenticated: boolean): Promise<Tokens> {
        try {
            const tokens: Tokens = await this.signTokens(user.id || user.sub, user.login || user.username, twoFactorAuthenticated);
			return tokens;
        }
        catch (error) {
            console.log("Error:" + error.message);
        }
    }

    async signTokens(userId: number, login: string, twoFactorAuthenticated: boolean): Promise<Tokens> {

        const jwtPayload: JwtPayload = {
            sub: userId,
            login: login,
            twoFactorAuthenticated: twoFactorAuthenticated,
        }

        try {
            const [at, rt] = await Promise.all([
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.configService.get<string>('jwtSecret'),
                expiresIn: "1d",
            }),
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.configService.get<string>('jwtRefreshSecret'),
                    expiresIn: "7d",
                })
            ]);

            return { access_token: at, refresh_token: rt };
        }
        catch (error) {
            console.log(error.message);
        }
    }

    // async verifyRefreshToken(req: any, res: Response): Promise<any> {
    //     try {
    //         // Get the refresh token
    //         const token = this.extractCookieByName(req, 'rt');
    //         if (!token) {
    //             throw new UnauthorizedException('Refresh token not found');
    //         }

    //         const secret = this.configService.get<string>('jwtRefreshSecret');
    //         const payload = await this.jwtService.verifyAsync(token, { secret });
    //         return payload; // Return the payload if the token is verified
    //     } catch (error) {
    //         console.log("Verify Refresh Token Error:", error.message);
    //         throw new UnauthorizedException('Invalid refresh token');
    //     }
    // }

    extractCookieByName(req: any, cookieName: string): string {
        let value: string | null = null;
        if (req && req.cookies) {
            value = req.cookies[cookieName];
        }
        return value;
    }

    isTwoFactorAuthenticated(req: any): boolean {
        return req.user.twoFactorAuthenticated;
    }
}
