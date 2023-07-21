import { Body, Controller, Get, Put, Post, Param, Req, Res } from '@nestjs/common'; //We could bring all this in user module, but we want to keep it separate for more clarity ?
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { Public } from '../public.routes';
import { FirstLoginDto } from './dto/firstLoginDto';
import { FirstLoginService } from './firstLogin.service';

@ApiTags('FirstLogin')
@Public() //TODO: delete when auth is done
@Controller('firstLogin')
export class FirstLoginController {
	constructor(private userService: UsersService, private firstLoginService: FirstLoginService) {}

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
			await this.userService.updateUsername(Number(updateData.userId), updateData.newUsername);
		} catch (error) {
			return error;
		}
	}

	@Get('/getUser/:userId')
	async getUserByName(@Param('userId') userId: string): Promise<any> {
		try {;
			return await this.userService.getUserFromId(Number(userId));
		} catch (error) {
			return error;
		}
	}
}


