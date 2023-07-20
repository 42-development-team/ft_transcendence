import { Body, Controller, Get, Put, Post, Param, Req, Res } from '@nestjs/common'; //We could bring all this in user module, but we want to keep it separate for more clarity ?
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from '../public.routes';

@ApiTags('FirstLogin')
@Public() //TODO: delete when auth is done
@Controller('firstLogin')
export class FirstLoginController {
	constructor(private userService: UsersService, private prisma: PrismaService) {}

	@Post('/doesUserNameExist/:username')
	async doesUserExistByUsername(@Param() username: string): Promise<boolean> {
		try {
			const userDB = await this.userService.getUserFromUsername(username);
			if (userDB.username) {
				return true;
			}
		} catch (error) {
			return false;
		}
	}

	@Put('/updateUsername')
	async updateUsername(@Body() newUsername: string, userId: string): Promise<any> {
		try {
			this.userService.updateUsername(Number(userId), newUsername);
		} catch (error) {
			return error;
		}
	}

	@Get('/getUserName/:userId')
	async getUserByName(@Param('userId') userId: string): Promise<any> {
		try {;
			const user = await this.userService.getUserFromId(Number(userId));
			return user;
		} catch (error) {
			return error;
		}
	}
}


