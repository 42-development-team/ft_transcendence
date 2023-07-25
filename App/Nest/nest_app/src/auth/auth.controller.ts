import { Controller, Get, Body, Req, Res, Param, Put, Post, Redirect, UseGuards, Query, Header, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { AuthService } from './auth.service';
import { Public } from './public.routes';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from './types/token.type';
import { GetAuthBoolean } from 'src/common/custom-decorators/get-current-user-id.decorator';


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
            // res.status(401).send(error.message);
            console.error("Error: callback error:" + error.message);
        }
    }

    @Get('jwt')
    async getJwt(@Req() req: any, @Res({passthrough: true}) res: Response) {
        try {
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false,
                httpOnly: true,
            }
            const jwt = await this.authService.getTokens(req.user, true);
            res.clearCookie("jwt")
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
            this.authService.logout(res);
        }
        catch (error) {
            console.log(error.message);
        }
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
            const tokenObject: Tokens = await this.authService.getTokens(req.user, req.twoFactorAuthenticated);
            res.clearCookie('jwt', cookieOptions)
            .clearCookie('rt', cookieOptions);

            res.cookie('jwt', tokenObject.access_token, cookieOptions);
            res.cookie('rt', tokenObject.refresh_token, cookieOptions);
            res.send();
        }
        catch(error) {
            console.log("Generate New Tokens Error:", error.message);
        }
    }

    @Get('profile')
    getProfile(@Req() req) {
        if (this.authService.isTwoFactorAuthenticated(req)) {
            // console.log(req.user);
            return req.user;
        }
        else
            console.log("You didn't validate 2fa process");
    }

    @Public()
    @Get('firstLogin/doesUserNameExist/:username')
	async doesUserExistByUsername(@Param('username') username: string): Promise<boolean> {
		try {
			const userDB = await this.userService.getUserFromUsername(username);
			if (userDB) {
				console.log('user exists');
				return true;
			}
			else
				return false;
		} catch (error) {
			throw new Error("Error fetching user in first login: " + error);
		}
	}

    @Public()
	@Put('firstLogin/updateUsername')
	async updateUsername(@Body() updateData: FirstLoginDto): Promise<any> {
		try {
			await this.userService.updateUsername(Number(updateData.userId), updateData.newUsername);
		} catch (error) {
			return error;
		}
	}

    @Public()
	@Get('firstLogin/getUser/:userId')
	async getUserByName(@Param('userId') userId: string): Promise<any> {
		try {;
			return await this.userService.getUserFromId(Number(userId));
		} catch (error) {
			return error;
		}
	}
}
