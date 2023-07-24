import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './types/jwtPayload.type';
import { Tokens } from './types/token.type';
import { ConfigService } from '@nestjs/config';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
        ) {}
        
    async redirectTwoFA(req: any, res: Response) {
        const frontUrl = `http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}` as string;
        
        console.log("redirect2FA");
        try {
            const userDB = await this.usersService.getUserFromLogin(req.user.login);
            if (userDB)
                var jwt = await this.getTokens(userDB, false);
                const cookieOptions = {
                    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    secure: false,
                    httpOnly: true,
                }
                
                if (userDB.isFirstLogin) {
                console.log("firstlogin");

                res.status(200)
                .cookie("jwt", jwt.access_token, cookieOptions)
                .redirect(`${frontUrl}/firstLogin/`);
                this.changeLoginBooleanStatus(userDB);
            }
            else if (userDB.isTwoFAEnabled) {
                console.log("2fa enabled");

                res.status(200)
                .cookie("jwt", jwt.access_token, cookieOptions)
                .redirect(`${frontUrl}/auth/2fa`);
            }
            else {
                console.log("else");

                jwt = await this.getTokens(userDB, true);
                res.status(200)
                .cookie("jwt", jwt.access_token, cookieOptions)
                .cookie("rt", jwt.refresh_token, cookieOptions)
                .redirect(`${frontUrl}/home/`);
            }
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    async changeLoginBooleanStatus(user: any) {
        if (user.isFirstLogin) {
            await this.prisma.user.updateMany({
                where: { username: user.username },
                data: { isFirstLogin: false },
            });
        }
    }

    async logout(res: Response) {
        const cookieOptions = {
            secure: false,
            httpOnly: true,
        }
        res.clearCookie("jwt", cookieOptions)
        .clearCookie("rt", cookieOptions)
        .redirect(`${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}`);
    }    
    
    async getTokens(user: any, twoFactorAuthenticated: boolean): Promise<Tokens> {
       try {
        console.log("getTokens");
        console.log(user);
           const tokens: Tokens = await this.signTokens(user.id || user.sub, user.login || user.username, twoFactorAuthenticated);
           return tokens;
        }
        catch (error) {
            console.log("Error:" + error.message);
        }
    }

    async signTokens(userId: number, login: string, twoFactorAuthenticated: boolean): Promise<Tokens> {
        console.log("signTokens");
        console.log(userId);
        console.log(login);
        const jwtPayload: JwtPayload = {
            sub: userId,
            login: login,
            twoFactorAuthenticated: twoFactorAuthenticated,
        }

        try {
            const [at, rt] = await Promise.all([
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.configService.get<string>('jwtSecret'),
                expiresIn: "30m",
            }),
                this.jwtService.signAsync(jwtPayload, {
                    secret: this.configService.get<string>('jwtRefreshSecret'),
                expiresIn: "7d",
            })
            ]);
            
            return {access_token: at, refresh_token: rt};
        }
        catch (error) {
            console.log(error.message);
        }
    }

    async verifyRefreshToken(req: any, res: Response) {
        try {
            // get refresh token
            const token = this.extractCookieByName(req, 'rt');
            if (!token) throw UnauthorizedException;
            
            const secret = this.configService.get<string>('jwtRefrehSecret');
            const isVerify = await this.jwtService.verifyAsync(token, {secret});
            
            console.log("isVerify:",isVerify);
            return isVerify;
            
        }
        catch(error) {
            console.log("Verify Refresh Token Error:", error.message);
        }
    }

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

// async getJwtFromIdCookie(req: any, res: Response) {
//     let userId: string = this.extractCookieByName(req, 'userId');
//     if (userId) {
//         const id = parseInt(userId);
//         const userDB = await this.prisma.user.findUniqueOrThrow({
//             where: { id: id },
//         });
//         const jwt = await this.getTokens(userDB, "30m", "7d");
//         const cookieOptions = {
//             expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//             secure: false, // if httpS => true
//             httpOnly: true,
//         }
//         return {jwt, cookieOptions};
//     }
//     return null;
// }
