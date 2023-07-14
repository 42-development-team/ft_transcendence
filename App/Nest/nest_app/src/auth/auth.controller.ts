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
    @Get('logIn')
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
            const jwt = await this.authService.logIn(req.user);

            const isVerify = await this.authService.verifyJWT(jwt.refresh_token);

            await this.authService.redirectTwoFA(req, res, isVerify);
            await this.authService.changeLoginBooleanStatus(req.user);

            // console.log(jwt);
            return jwt;
        }
        catch (error) {
            // res.status(401).send(error.message);
            console.error("Error: callback error:" + error.message);
        }
    }

    /* When our GET /profile route is hit, the Guard will automatically invoke our passport-jwt custom configured strategy,
        validate the JWT, and assign the user property to the Request object
    */

    // @Public();
    @Get('profile')
    getProfile(@Req() req) {
        console.log("/profile");
        return req.user;
    }
}
