import { PrismaService } from "src/prisma/prisma.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";

export class UserStatsService {
	constructor(private prisma: PrismaService) {}

	/* C(reate) */
	async createUserStats( userIdDto: UserIdDto ) {
		const newUserStats = await this.prisma.userStats.create({
			data: {
				user: { connect: { id: userIdDto.userId } },
			},
		});
	}

	/* R(ead) */
	async getUserStats( userIdDto: UserIdDto ): Promise<UserStatsDto> {
		const stats = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where:  { id: userIdDto.userId } ,
		});
		return stats.userStats;
	}
}