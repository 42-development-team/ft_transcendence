import { Injectable } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { PrismaService } from '../prisma/prisma.service';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from "../users/users.service";

@Injectable()
export class MembershipService {
	constructor(
		private prisma: PrismaService,
		// private jwtService: JwtService,
        // private userService: UsersService,
		// private configService: ConfigService
	) {}

  async create(userId: number, chatRoomId: number) {
	const createdMembership = await this.prisma.membership.create({
		data: {
			user: { connect: { id: userId } },
			chatroom: { connect: { id: chatRoomId } },
		},
	});

    return createdMembership;
  }

  findAll() {
    return `This action returns all membership`;
  }

  async getMemberShipFromUserAndChannelId(userId: number, channelId: number) {
	try {
		const memberShip = await this.prisma.membership.findFirst({
			where:
				  { userId: userId, chatRoomId: channelId }
		})
		return memberShip;
	}
	catch (error) {
		console.log(error.message);
	}
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return `This action updates a #${id} membership`;
  }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
