import { Controller, Request, Param, Patch, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SocketGateway } from 'src/sockets/socket.gateway';
import { UsersService } from 'src/users/users.service';
import { FriendDto } from './friend.dto';
import { FriendService } from "./friend.service";

@Controller('friend')
export class FriendController {
	constructor(
		private friendService: FriendService,
		private socketGateway: SocketGateway,
		private userService: UsersService,
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
		// Check for direct messages and delete them
		const room = await this.friendService.removeDirectMessagesForBlockedUser(Number(blockedId), userId);
		if (room) {
			const userSocketId = await this.userService.getUserSocketFromId(userId);
			const blockedUserSocketId = await this.userService.getUserSocketFromId(Number(blockedId));
			const userSocket = this.socketGateway.clients.find(c => c.id === userSocketId);
			const blockedUserSocket = this.socketGateway.clients.find(c => c.id === blockedUserSocketId)
			userSocket.leave(room.name);
			userSocket.emit('leftRoom', {room: room.name});
			blockedUserSocket.leave(room.name);
			blockedUserSocket.emit('leftRoom', {room: room.name});
		}
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