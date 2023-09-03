import { Controller, Request, Param, Patch, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FriendDto } from './friend.dto';
import { FriendService } from "./friend.service";

@Controller('friend')
export class FriendController {
	constructor(
		private friendService: FriendService,
	) { }

	/* C(reate) */
	/* R(ead) */
	@Get('blocked')
	async getBlockedUsers(@Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const blockedUsers: FriendDto[] = await this.friendService.getBlockedUsers(userId);
		res.send(blockedUsers);
	}		

	/* U(pdate) */
	@Patch('block/:blockedId')
	async blockUser(@Param('blockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const user: FriendDto = await this.friendService.blockUser(Number(blockedId), userId);
		res.send(user);
	}


	/* D(elete) */
}