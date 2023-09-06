import { Controller, Request, Param, Patch, Get, Res, Body } from '@nestjs/common';
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

	@Patch('addFriend')
	async addFriend(@Param('addedUserId') @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const friends: FriendDto[] = await this.friendService.addFriend(userId, addedUserId);
		res.send(friends);
	}

	@Patch('block/:blockedId')
	async blockUser(@Param('blockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const user: FriendDto = await this.friendService.blockUser(Number(blockedId), userId);
		res.send(user);
	}


	/* D(elete) */
	@Patch('unblock/:unblockedId')
	async unblockUser(@Param('unblockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const user: FriendDto = await this.friendService.unblockUser(Number(blockedId), userId);
		res.send(user);
	}
}
