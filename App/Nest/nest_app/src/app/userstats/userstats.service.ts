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

	/* U(pdate) */
	async updateUserStats( userId: number, userUpdateDto: UserStatsDto ) {
		const updatedStats = await this.prisma.userStats.update({
			where: { userId: userUpdateDto.userId },
			data: { 
					winStreak: userUpdateDto.winStreak,
					win: userUpdateDto.win,
					lose: userUpdateDto.lose,
					totalScore: userUpdateDto.totalScore,
					ratio: userUpdateDto.ratio,
					played: userUpdateDto.played,
			},
		});
	}

	/* D(elete) */
	async deleteUserStats( userIdDto: UserIdDto ) {
		this.prisma.userStats.delete({
			where: { userId: userIdDto.userId },
		});
	}
}