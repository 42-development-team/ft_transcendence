import { Controller, Request, Param, Patch, Res } from '@nestjs/common';
import { Response } from 'express';
import { FriendDto } from './friend.dto';
import { FriendService } from "./friend.service";

@Controller('friend')
export class FriendController {
    constructor(
        private friendService: FriendService,
    ) {}

    /* C(reate) */
    /* R(ead) */
    /* U(pdate) */
    @Patch('block/:blockedId')
    async blockUser(@Param('blockedId') blockedId: string, @Request() req: any, @Res() res: Response) {
        const userId = req.user.sub;
        const user : FriendDto = await this.friendService.blockUser(Number(blockedId), userId);
        res.send(user);
    }


    /* D(elete) */
}