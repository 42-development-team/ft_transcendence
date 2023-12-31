import { Controller, Get, Body, Req, Res, UseGuards, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { AuthService } from './auth.service';
import { Public } from './public.routes';
import { UsersService } from '../users/users.service';
import { FirstLoginDto } from './dto/firstLoginDto';
import { filterSensitiv } from 'src/utils/filterSensitiv';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
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
        try {
            await this.authService.redirectTwoFA(req, res);
        }
        catch (error) {
            console.error("Error: callback error:" + error.message);
        }
    }

    @Get('jwt')
    async getJwt(@Req() req: any, @Res({passthrough: true}) res: Response) {
        try {
            await this.authService.changeLoginBooleanStatus(req.user.sub);
            const jwt = await this.authService.getTokens(req.user, true);
            res.cookie("jwt", jwt.access_token, {sameSite: "lax"});
        }
        catch (error) {
            console.log("Error: " + error.message);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('logout')
    async logout(@Res() res: Response, @Req() req: any) {
        try {
			const userId: number = req.user.sub;
			const user = this.userService.getUserFromId(userId);
            await this.authService.logout(res);
            res.send('Logged out successfully.');
        }
        catch (error) {
            console.log(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred during logout.');
        }
    }

    @Get('profile')
    getProfile(@Req() req: any, @Res() res: Response) {
        if (this.authService.isTwoFactorAuthenticated(req)) {
            return res.send(req.user);
        }
        else {
            return res.status(HttpStatus.OK).send({
                message: "Two-factor authentication not completed",
                user: req.user
            });
        }
    }

    @Get('doesUserNameExist/:username')
    async doesUserNameExist(@Param('username') username: string, @Res() res: Response) {
        try {
            const user = await this.userService.getUserFromUsername(username);
            const isUsernameTaken = !!user;
            res.status(HttpStatus.OK).send({ isUsernameTaken });
        } catch (error) {
            console.error('Error checking username availability:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred while checking username availability.');
        }
    }
}
