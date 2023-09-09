import { Controller, Get, Body, Req, Res, UseGuards, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoAuthGuards } from './guards/42-auth.guards';
import { AuthService } from './auth.service';
import { Public } from './public.routes';
import { UsersService } from '../users/users.service';
import { FirstLoginDto } from './dto/firstLoginDto';

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
            const cookieOptions = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                secure: false,
                httpOnly: true,
            }
            const jwt = await this.authService.getTokens(req.user, true);
            res.cookie("jwt", jwt.access_token, cookieOptions)
            .cookie("rt", jwt.refresh_token, cookieOptions);
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
			this.authService.updateCurrentStatus(user, userId, "offline");
            await this.authService.logout(res);
            res.send('Logged out successfully.');
        }
        catch (error) {
            console.log(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred during logout.');
        }
    }

    @Get('profile')
    getProfile(@Req() req, @Res() res: Response) {
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

    @Public()
    @Get('firstLogin/doesUserNameExist/:username')
    async doesUserNameExist(@Param('username') username: string, @Res() res: Response) {
        try {
            const user = await this.userService.getUserFromUsername(username);
            const isUsernameTaken = !!user; // double negation to turn user into a boolean
            //If the user object is not null or undefined (truthy),
            // !!user will evaluate to true, indicating that the username is taken.
            // If the user object is null or undefined (falsy),
            // !!user will evaluate to false, indicating that the username is available.
            res.status(HttpStatus.OK).send({ isUsernameTaken });
        } catch (error) {
            console.error('Error checking username availability:', error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred while checking username availability.');
        }
    }

    @Public()
    @Put('firstLogin/updateUsername')
    async updateUsername(@Body() updateData: FirstLoginDto): Promise<any> {
        try {
            const userId = Number(updateData.userId);
            const updatedUser = await this.userService.updateUsername(userId, updateData.newUsername);
            return updatedUser;
        } catch (error) {
            console.error('Error updating username:', error);
            throw error;
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

    // @Get('refresh')
    // async generateNewTokens(@Req() req: any, @Res() res: Response) {
    //     try {
    //         const payload = await this.authService.verifyRefreshToken(req,  res);
    //         if (!payload) throw new UnauthorizedException('Invalid refresh token');

    //         const cookieOptions = {
    //             expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //             secure: false,
    //             httpOnly: true,
    //         }
    //         const tokenObject: Tokens = await this.authService.getTokens(payload, payload.twoFactorAuthenticated);

    //         res.cookie('jwt', tokenObject.access_token, cookieOptions);
    //         res.cookie('rt', tokenObject.refresh_token, cookieOptions);
    //         res.send();
    //     } catch (error) {
    //         console.log("Generate New Tokens Error:", error.message);
    //         if (error instanceof UnauthorizedException) {
    //             res.status(HttpStatus.UNAUTHORIZED).send('Unauthorized' + error.message) // error 401
    //         } else {
    //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An error occurred while generating new tokens.');
    //             throw error;
    //         }
    //     }
    // }
}
