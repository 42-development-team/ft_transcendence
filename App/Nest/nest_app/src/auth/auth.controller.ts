import { Controller, Get, Body, Req, Res, Post, Redirect, UseGuards, Query, Header, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoAuthGuards } from './42-auth.guards';
import { JwtAuthGuard } from './jwt-auth.guards';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

const URL: string = process.env.INTRA42_URL; 

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private prisma: PrismaService) {}

    @Get('42')
    @UseGuards(FortyTwoAuthGuards)
    async redir() {}

    @UseGuards(FortyTwoAuthGuards)
    @Get('42/callback')
    async callback(@Req() req: any, @Res() res: Response) {
        // here I catch my profile user in req due to FortyTwoStrat used by the useGuards decorator
        
        // console.log(req.user);

        // I have to create or find the user in db
        // get a sign token from jwt.sign method
        // inject the jwt token in the client cookies
        try {
            const token = await this.authService.login(req);
            const isVerify = this.authService.verifyJWT(token);
            const userDB = await this.prisma.user.findUnique({
                where: { username: req.user.username },
            });
            console.log(userDB);
            if (isVerify && userDB.isTwoFAEnabled) {
                console.log('token verified');
                res.status(200).redirect('http://localhost:3000/auth/2fa');//redirect when 2fa is enabled
                return ;
            }
            else if (isVerify) {
                res.status(200).redirect('http://localhost:3000/settings');//redirect in settings if 2fa is not enable, todo: enable 2fa if box checked at first login, if not redirect on home page => create a task for that
                return ;
            }
            res.status(401).send('error unvalid token');
        }
        catch (error) {
            res.status(401).send(error.message);
            console.error(error.message);
        }
    }

    /* When our GET /profile route is hit, the Guard will automatically invoke our passport-jwt custom configured strategy,
        validate the JWT, and assign the user property to the Request object
    */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Res() res) {
        res.json('success');
        // return req.user;
    }
}
