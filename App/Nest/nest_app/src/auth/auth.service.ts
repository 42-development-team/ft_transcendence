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

    verifyJWT(token: string): any {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            return null;
        }
    }

    async login(req: any): Promise<string> {
       try {
            const jwtSigned = await this.generateJWT(req.user.id);
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
        if (userDB.isTwoFAEnabled) {
            console.log('token verified');
            res.status(200).redirect('http://localhost:3000/auth/2fa');
        }
        else {
            if (userDB.isFirstLogin)
                
            res.status(200).redirect('http://localhost:3000/settings');
        }
    }
}
