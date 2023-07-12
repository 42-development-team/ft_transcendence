import { Controller, Get, Body, Req, Res, Post, Redirect, UseGuards, Query, Header } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoAuthGuards } from './42-auth.guards';
import { JwtAuthGuard } from './jwt-auth.guards';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './passport-strat';

const URL: string = process.env.INTRA42_URL; 

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

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
            res.status(200).json(req.user);
        }
        catch (error) {
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
