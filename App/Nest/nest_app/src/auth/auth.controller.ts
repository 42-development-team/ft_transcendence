import { Controller, Get, Body, Req, Res, Post, UseGuards, Query, Header } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortryTwoAuthGuards } from './42-auth.guards';
import { JwtAuthGuard } from './jwt-auth.guards';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './passport-strat';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(FortyTwoStrategy)
    @Get('42')
    async fortyTwoLogin() {}

    @UseGuards(FortryTwoAuthGuards)
    @Get('42/callback')
    async callback(@Req() req: any, @Res() res: Response) {
        // here I catch my profile user in req due to FortyTwoStrat used by the useGuards decorator
        console.log(req.user);

        // I have to create or the user in db
        // get a sign token from jwt.sign method
        // inject the jwt token in the client cookies
        const token = await this.authService.login(req);
    
        console.log(token);

        // set the token as Header in the response object 
        // res.set('Header', token);
        res.headers['authorization'] = token;
        // res.json(req.user);
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
