import { Body, Controller, Get, Put, Post, Param, Req, Res } from '@nestjs/common'; //We could bring all this in user module, but we want to keep it separate for more clarity ?
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Public } from '../public.routes';
import { FirstLoginDto } from './firstLoginDto';

@ApiTags('FirstLogin')
@Public() //TODO: delete when auth is done
@Controller('firstLogin')
export class FirstLoginController {
	constructor(private userService: UsersService, private prisma: PrismaService) {}

	@Get('/doesUserNameExist/:username')
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

	@Put('/updateUsername')
	async updateUsername(@Body() updateData: FirstLoginDto): Promise<any> {
		try {
			console.log('newUsername: ' + updateData.newUsername);
			console.log('userId: ' + updateData.userId);
			await this.userService.updateUsername(Number(updateData.userId), updateData.newUsername);
		} catch (error) {
			return error;
		}
	}

	@Get('/getUser/:userId')
	async getUserByName(@Param('userId') userId: string): Promise<any> {
		try {;
			const user = await this.userService.getUserFromId(Number(userId));
			return user;
		} catch (error) {
			return error;
		}
	}
}


