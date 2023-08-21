import { PrismaService } from "src/prisma/prisma.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";
import { stat } from "fs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserStatsService {
	constructor(private prisma: PrismaService) {}

	/* C(reate) */
	async createUserStats( userIdDto: UserIdDto ) {
		const newUserStats = await this.prisma.userStats.create({
			data: {
				user: { connect: { id: userIdDto.userId } },
			},
		});
		return newUserStats;
	}

	/* R(ead) */
	async getUserStats( userId: number ): Promise<UserStatsDto> {
		console.log("userId READ:", userId);
		const stats = await this.prisma.userStats.findUniqueOrThrow({
			where:  { id: userId },
		});
		console.log("stats READ in service:", stats)
		if (stats === undefined || !stats) {
			const newUserStats = await this.createUserStats({ userId: userId });
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
			return newUserStats;
		}
		return stats;
	}

	/* U(pdate) */
	async updateUserStats( userId: number, userUpdateDto: UserStatsDto ) {
		const updatedStats = await this.prisma.userStats.update({
			include: { user: true},
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