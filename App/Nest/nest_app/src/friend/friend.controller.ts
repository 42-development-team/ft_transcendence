import { Controller, Request, Param, Patch, Get, Res, Body } from '@nestjs/common';
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
	@Get('getFriends')
	async getFriends(@Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const friends: FriendDto[] = await this.friendService.getFriends(userId);
		res.send(friends);
	}

	@Get('getInvitedFriends')
	async getInvitedFriends(@Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const friends: FriendDto[] = await this.friendService.getInvitedFriends(userId);
		res.send(friends);
	}

	@Get('getFriendsRequest')
	async getFriendsRequest(@Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const friends: FriendDto[] = await this.friendService.getFriendsRequest(userId);
		res.send(friends);
	}

	@Get('blocked')
	async getBlockedUsers(@Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const blockedUsers: FriendDto[] = await this.friendService.getBlockedUsers(userId);
		res.send(blockedUsers);
	}

	/* U(pdate) */
	@Patch('requestFriend/:addedUserId')
	async requestFriend(@Param('addedUserId') addedUserId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		await this.friendService.requestFriend(userId, Number(addedUserId));
		this.socketGateway.handleFriendUpdate(userId, Number(addedUserId));
		res.send("Friend request send successfully");
	}

	@Patch('removeFriend/:removedUserId')
	async removeFriend(@Param('removedUserId') removedUserId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		await this.friendService.removeFriend(userId, Number(removedUserId));
		this.socketGateway.handleFriendUpdate(userId, Number(removedUserId));
		res.send("Friend removed successfully");
	}

	@Patch('cancelFriend/:canceledUserId')
	async cancelFriend(@Param('canceledUserId') canceledUserId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		await this.friendService.removeFriendInvite(userId, Number(canceledUserId));
		await this.friendService.removeFriendInvite(Number(canceledUserId), userId);
		this.socketGateway.handleFriendUpdate(userId, Number(canceledUserId));
		res.send("Friend request canceled successfully");
	}

	@Patch('acceptFriend/:acceptedUserId')
	async acceptFriend(@Param('acceptedUserId') acceptedUserId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		await this.friendService.acceptFriend(userId, Number(acceptedUserId));
		this.socketGateway.handleFriendUpdate(userId, Number(acceptedUserId));
		res.send("Friend request accepted successfully");
	}

	@Patch('refuseFriend/:refusedUserId')
	async refuseFriend(@Param('refusedUserId') refusedUserId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		await this.friendService.refuseFriend(userId, Number(refusedUserId));
		this.socketGateway.handleFriendUpdate(userId, Number(refusedUserId));
		res.send("Friend request refused successfully");
	}

	@Patch('block/:blockedId')
	async blockUser(@Param('blockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const user: FriendDto = await this.friendService.blockUser(Number(blockedId), userId);
		// Check for pending friend invites and delete them
		await this.friendService.removeFriendInvite(Number(blockedId), userId);
		await this.friendService.removeFriendInvite(userId, Number(blockedId));
		this.socketGateway.handleFriendUpdate(userId, Number(blockedId));
		// Check for direct messages and delete them
		const room = await this.friendService.removeDirectMessagesForBlockedUser(Number(blockedId), userId);
		if (room) {
			const userSocketId = await this.userService.getUserSocketFromId(userId);
			if (userSocketId) {
				const userSocket = this.socketGateway.clients.find(c => c.id === userSocketId);
				userSocket.leave(room.name);
				userSocket.emit('leftRoom', { room: room.name });
			}
			const blockedUserSocketId = await this.userService.getUserSocketFromId(Number(blockedId));
			if (blockedUserSocketId) {
				const blockedUserSocket = this.socketGateway.clients.find(c => c.id === blockedUserSocketId);
				blockedUserSocket.leave(room.name);
				blockedUserSocket.emit('leftRoom', {room: room.name});
			}
		}
		this.socketGateway.handleBlockUpdate(userId);
		res.send(user);
	}

	/* D(elete) */
	@Patch('unblock/:unblockedId')
	async unblockUser(@Param('unblockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
		const userId = req.user.sub;
		const user: FriendDto = await this.friendService.unblockUser(Number(blockedId), userId);
		this.socketGateway.handleBlockUpdate(userId);
		res.send(user);
	}
}
