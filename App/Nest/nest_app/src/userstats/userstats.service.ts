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
		const stats = await this.prisma.userStats.findUnique({
			where:  { id: userIdDto.userId },
		});
		if ( stats ) {
			throw new Error("UsersStats already exists");
		}
		const newUserStats = await this.prisma.userStats.create({
			data: {
				user: { connect: { id: userIdDto.userId } },
			},
		});
		return newUserStats;
	}

	/* R(ead) */
	async getUserStats( userId: number ): Promise<UserStatsDto> {
		const user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		const userName = user.username;

		let statsDto = {
			userId: user.id,
			userName: userName,
			winStreak: 0,
			win: 0,
			lose: 0,
			totalScore: 0,
			ratio: 0,
			played: 0,
		};

		if (user.userStats === undefined || !user.userStats) {
			const newUserStats = await this.createUserStats({ userId: userId });
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
			return statsDto;
		}

		statsDto.winStreak = user.userStats.winStreak;
		statsDto.win = user.userStats.win;
		statsDto.lose = user.userStats.lose;
		statsDto.totalScore = user.userStats.totalScore;
		statsDto.ratio = user.userStats.ratio;
		statsDto.played = user.userStats.played;
		
		return statsDto;
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
					ratio: userUpdateDto.win / userUpdateDto.played,
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