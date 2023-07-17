import { Controller, Get, Body, Req, Res, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from './public.routes';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private prisma: PrismaService) {}

    @Public()
    @UseGuards(FortyTwoAuthGuards)
    @Get('login')
    async redir() {}

    @Public()
    @UseGuards(FortyTwoAuthGuards)
    @HttpCode(HttpStatus.CREATED)
    @Get('42/callback')
    async callback(@Req() req: any, @Res() res: Response) {
        // here I catch my profile user in req due to FortyTwoStrat used by the useGuards decorator

        // I have to create or find the user in db
        // get a sign token from jwt.sign method
        // inject the jwt token in the client cookies
        try {
            const jwt = await this.authService.login(req.user);

            
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false, // if httpS => true
                httpOnly: true,
            }
            res.cookie("jwt", jwt.access_token, cookieOptions);
            
            const isVerify = await this.authService.verifyJWT(jwt.refresh_token);
            await this.authService.redirectTwoFA(req, res, isVerify);
            await this.authService.changeLoginBooleanStatus(req.user);

        }
        catch (error) {
            // res.status(401).send(error.message);
            console.error("Error: callback error:" + error.message);
        }
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie("jwt");
        res.redirect('http://localhost:3000');
        // this.authService.logout(res);
    }
    /* When our GET /profile route is hit, the Guard will automatically invoke our passport-jwt custom configured strategy,
        validate the JWT, and assign the user property to the Request object
    */
    @Get('profile')
    getProfile(@Req() req) {
        console.log(req.user);
        return req.user;
    }
}
