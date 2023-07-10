import { Controller, Get, Body, Req, Res, Post, UseGuards, Query, Header } from '@nestjs/common';
// import { Request, Response } from 'express';
import { FortyTwoAuthGuards } from './42-auth.guards';
import { JwtAuthGuard } from './jwt-auth.guards';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './passport-strat';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(FortyTwoAuthGuards)
    @Get('42/callback')
    async callback(@Req() req: any, @Res() res: Response) {
        // here I catch my profile user in req due to FortyTwoStrat used by the useGuards decorator
        
        // console.log(req.user);

        // I have to create or find the user in db
        // get a sign token from jwt.sign method
        // inject the jwt token in the client cookies
        try {
            // const token = await this.authService.login(req);
            // if (await this.authService.verifyJWT(token)) {
            //     throw new Error('ERROR: Failed to verify JWT token');
            // }
            // await this.authService.redirectTwoFAVerify();
        }
        catch (error) {
            console.error(error.message);
        }

        // console.log(token);

        // set the token as Header in the response object ?
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
