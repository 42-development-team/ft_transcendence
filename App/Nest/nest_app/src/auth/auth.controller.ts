import { Controller, Get, Body, Req, Res, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from './public.routes';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/token.type';


@Controller('auth')
export class AuthController {

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) {}

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
            await this.authService.redirectTwoFA(req, res);
        }
        catch (error) {
            // res.status(401).send(error.message);
            console.error("Error: callback error:" + error.message);
        }
    }

    
    @Public()
    @Get('jwt')
    async getJwt(@Req() req: any, @Res({passthrough: true}) res: Response) {
        try {
            const {jwt, cookieOptions} = await this.authService.getJwtFromIdCookie(req, res);
            res.clearCookie("userId")
            .cookie("jwt", jwt.access_token, cookieOptions)
            .cookie("rt", jwt.refresh_token, cookieOptions);
        }
        catch (error) {
            console.log("Error: " + error.message);
        }
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('logout')
    async logout(@Res() res: Response) {
        try {

            const cookieOptions = {
                // expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false,
                httpOnly: true,
            }
            res.clearCookie("jwt", cookieOptions)
            .clearCookie("rt", cookieOptions)
            .redirect(`${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}`);
        }
        catch (error) {
            console.log(error.message);
        }
        // this.authService.logout(res);
    }

    @Get('refresh')
    async generateNewTokens(@Req() req: any, @Res() res: Response) {
        try {
            const verified = this.authService.verifyRefreshToken(req,  res);
            if (!verified) throw UnauthorizedException;

            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false,
                httpOnly: true,
            }
            const tokenObject: Tokens = await this.authService.getTokens(req.user);
            res.clearCookie('jwt', cookieOptions).clearCookie('rt', cookieOptions);
            res.cookie('jwt', tokenObject.access_token, cookieOptions);
            res.cookie('rt', tokenObject.refresh_token, cookieOptions);
            res.send();
        }
        catch(error) {
            console.log("Generate Tokens Error:", error.message);
        }
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
