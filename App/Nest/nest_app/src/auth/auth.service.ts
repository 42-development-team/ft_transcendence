import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


// how to validate user in our case ?
interface FortyTwoUser {
    id: number,
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,

    ) {}

    async generateJWT(userId: number): Promise<string> {
        return await this.jwtService.sign({sub: userId});
    }

    async verifyJWT(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            return null;
        }
    }

    async login(user: any): Promise<string> {
       try {
           const jwtSigned = await this.generateJWT(user.id);
           return jwtSigned;
        }
        catch (error) {
            console.log("Error:" + error.message);
        }
    }

    async redirectTwoFA( req: any, res: Response, isVerifyUser: Boolean) {
        const userDB = await this.prisma.user.findUnique({
            where: { username: req.user.username },
        });
        if (!isVerifyUser)
            throw new UnauthorizedException('User not verified');
        if (userDB.isFirstLogin)
            res.status(200).redirect('http://localhost:3000/firstLogin/');
        else {
            if (userDB.isTwoFAEnabled) {
                console.log('token verified');
                res.status(200).redirect('http://localhost:3000/auth/2fa');
            }
            else
                res.status(200).redirect('http://localhost:3000/home');
        }
    }

    async changeLoginBooleanStatus(user: any) {
        if (user.isFirstLogin) {
            await this.prisma.user.update({
                where: { username: user.username },
                data: { isFirstLogin: false },
            });
        }
    }
}
