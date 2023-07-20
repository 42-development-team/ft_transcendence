import { Body, Controller, Get, Put, Post, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from '../public.routes';

@ApiTags('FirstLogin')
@Public() //TODO: delete when auth is done
@Controller('firstLogin')
export class FirstLoginController {
	constructor(private userService: UsersService, private prisma: PrismaService) {}

	@Post('/doesUserNameExist') //TODO: change this to GET method with request from front
	async doesUserExistByUsername(@Body() username: JSON): Promise<boolean> {
		try {
			const usernameObject = JSON.parse(JSON.stringify(username));
			const userDB = await this.userService.getUserFromUsername(usernameObject.username);
			if (userDB.username) {
				return true;
			}
		} catch (error) {
			return false;
		}
	}

	@Put('/updateUsername')
	async updateUsername(@Body() newUsername: string, username: string): Promise<any> {
		try {
			await this.prisma.user.update({
				where: { username: username },
				data: { username: newUsername },
			});	//TODO: when clem receive current user in front, change all this with an id update with user controller
		} catch (error) {
			return error;
		}
	}

	@Get('/getUserName/:userId')
	async getUserByName(@Param('userId') userId: string): Promise<any> {
		try {;
			const user = await this.userService.getUserFromId(Number(userId));
			console.log(user.username)
			return user;
		} catch (error) {
			return error;
		}
	}

}


