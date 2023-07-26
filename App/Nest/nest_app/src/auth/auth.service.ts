import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';
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
        ) {}
        
    async redirectTwoFA(req: any, res: Response) {
        const frontUrl = `http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}` as string;
        
        try {
            const userDB = await this.usersService.getUserFromLogin(req.user.login);
            if (userDB.isFirstLogin) {
                res.status(200)
                .cookie("userId", req.user.id)
                .redirect(`${frontUrl}/firstLogin/`);
                this.changeLoginBooleanStatus(userDB);
            }
            else if (userDB.isTwoFAEnabled) {
                res.status(200)
                .cookie("userId", req.user.id)
                .redirect(`${frontUrl}/auth/2fa`);
            }
            else {
                const {jwt, cookieOptions} = await this.getJwtFromIdCookie(req, res);
                res.status(200)
                .clearCookie("userId", cookieOptions)
                .cookie("jwt", jwt.access_token, cookieOptions)
                .cookie("rt", jwt.refresh_token, cookieOptions)
                .redirect(`${frontUrl}/home/`);
            }
        } catch (error) {
            throw new Error('Redirect error');
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
    
    async getJwtFromIdCookie(req: any, res: Response) {
        let userId: string = this.extractCookieByName(req, 'userId');
        if (userId) {
            const id = parseInt(userId);
            const userDB = await this.prisma.user.findUniqueOrThrow({
                where: { id: id },
            });
            const jwt = await this.getTokens(userDB);
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false, // if httpS => true
                httpOnly: true,
            }
            return {jwt, cookieOptions};
        }
        return null;
    }

    async getTokens(user: any): Promise<Tokens> {
       try {
           const tokens: Tokens = await this.signTokens(user.id, user.username);
           return tokens;
        }
        catch (error) {
            console.log("Error:" + error.message);
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

    async signTokens(userId: number, login: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            login: login,
        }

        try {
            const [at, rt] = await Promise.all([
                this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('jwtSecret'),
                expiresIn: '1d',
                }),
                this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('jwtRefreshSecret'),
                expiresIn: '7d',
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
}
