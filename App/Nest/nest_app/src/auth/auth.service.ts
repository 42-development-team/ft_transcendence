import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
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

    async verifyJWT(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            return null;
        }
    }

    async login(user: any): Promise<Tokens> {
       try {
           const tokens = await this.getToken(user.id, user.username);
           return tokens;
        }
        catch (error) {
            console.log("Error:" + error.message);
        }
    }

    async logout(res: Response) {
        const cookieOptions = {
            // expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        }
        res.clearCookie('jwt', cookieOptions);
    }


    async redirectTwoFA(req: any, res: Response) {
        const frontUrl = `http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}` as string;
        
        const userDB = await this.prisma.user.findUniqueOrThrow({
            where: { username: req.user.username },
        });
        console.log(frontUrl);
        if (userDB.isFirstLogin) {
            res.status(200).cookie("userId", req.user.id).redirect(`${frontUrl}/firstLogin/`);
            this.changeLoginBooleanStatus(userDB);
        }
        else if (userDB.isTwoFAEnabled) {
            res.status(200).cookie("userId", req.user.id).redirect(`${frontUrl}/auth/2fa`);
        }
        else {
            const {jwt, cookieOptions} = await this.getJwt(req, res);
            res.status(200).cookie("jwt", jwt.access_token, cookieOptions);
            res.redirect(`${frontUrl}/home/`);
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

    async getJwt(req: any, res: Response) {
        let userId = null;
        if (req && req.cookies) {
            userId = req.cookies['userId'];
        }
        if (userId) {
            userId = parseInt(userId);
            const userDB = await this.prisma.user.findUniqueOrThrow({
                where: { id: userId },
            });
            const jwt = await this.login(userDB);
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false, // if httpS => true
                httpOnly: true,
            }
            return {jwt, cookieOptions};
        }
        return null;
    }

    async getToken(userId: number, login: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            login: login,
        }

        try {
            const [at, rt] = await Promise.all([
                this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('jwtService'),
                expiresIn: '30m',
                }),
                this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get<string>('jwtService'),
                expiresIn: '7d',
                })
            ]);

            return {access_token: at, refresh_token: rt};
        }
        catch (error) {
            console.log(error.message);
        }
    }
}
