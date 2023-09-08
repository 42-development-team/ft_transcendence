import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { FriendController } from "./friend.controller";
import { FriendService } from "./friend.service";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [PrismaModule],
  controllers: [FriendController],
  providers: [FriendService, UsersService],
  exports: [FriendService]
})
export class FriendModule {}
