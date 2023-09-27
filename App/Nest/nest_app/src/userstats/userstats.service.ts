import { PrismaService } from "src/prisma/prisma.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { GameService } from "src/game/game.service";

@Injectable()
export class UserStatsService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => GameService))
		 private gameService: GameService
		 ) {}

	/* C(reate) */
	async createUserStats( userId: number ) {
		const stats = await this.prisma.userStats.findUnique({
			where:  { userId: userId },
		});
		if ( stats ) {
			return stats;
		}
		const newUserStats = await this.prisma.userStats.create({
			data: {
				user: { connect: { id: userId } },
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

		if (user.userStats === undefined || !user.userStats) {
			const newUserStats = await this.createUserStats(userId);
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
			return newUserStats;
		}

		return user.userStats;
	}

	async createUserStatsIfNotExists( user: any ) {
		if (user.userStats === undefined || user.userStats === null) {
			const newUserStats = await this.createUserStats(user.id);
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
		}
		const userUpdated = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: user.id },
		});
		return userUpdated;
	}

	async getLeaderBoard(userId: number) : Promise<UserStatsDto[]>{
		const user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		const username = user.username;
		await this.createUserStatsIfNotExists(user);
		const leaderBoard = await this.prisma.userStats.findMany({
			include: { user: true },
			orderBy: { totalScore: 'desc' },
		});
		console.log("leaderboard", leaderBoard);
		const leaderBoardDto = leaderBoard.map((userStats) => {
			return {
				userId: userStats.userId,
				userName: userStats.user.username,
				avatar: userStats.user.avatar,
				winStreak: userStats.winStreak,
				win: userStats.win,
				lose: userStats.lose,
				totalScore: userStats.totalScore,
				ratio: userStats.ratio,
				played: userStats.played,
			};
		});
		return leaderBoardDto;
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
					ratio: Number(((userUpdateDto.win / userUpdateDto.played) * 100).toFixed(2)),
					played: userUpdateDto.played,
			},
		});
		
	}

	async updateUserStatsOnEndGame( userId: number, isWinner: boolean, newElo: number ) {
		let user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		const win = isWinner ? 1 : 0;
		try {
			user = await this.createUserStatsIfNotExists(user);
			const updatedStats = await this.prisma.userStats.update({
				include: { user: true},
				where: { userId: user.id },
				data: {
					winStreak: win === 1 ? user.userStats.winStreak + 1 : 0,
					win: {
						increment: win,
					},
					lose: {
						increment: isWinner ? 0 : 1,
					},
					totalScore: newElo,
					ratio: Number(((user.userStats.win + win) / (user.userStats.played + 1)).toFixed(2)),
					played: {
						increment: 1,
					}
				},
			});
		} catch (error) {
			console.log(error);
		}
	}

	async eloComputing( winnerId: number, loserId: number ) {
		try {
			let winner = await this.prisma.user.findUniqueOrThrow({
				include: { userStats: true },
				where: { id: winnerId },
			});
			let loser = await this.prisma.user.findUniqueOrThrow({
				include: { userStats: true },
				where: { id: loserId },
			});
			winner = await this.createUserStatsIfNotExists(winner);
			loser = await this.createUserStatsIfNotExists(loser);

			const winnerElo = winner.userStats.totalScore;
			const loserElo = loser.userStats.totalScore;
			const eloDiff = Math.min(loserElo - winnerElo, 400);
			const expectedScore = 1 / (1 + Math.pow(10, eloDiff / 400)); //https://fr.wikipedia.org/wiki/Classement_Elo
			const kFactor = 32;
			const eloWinnerChange = Math.round(kFactor * (1 - expectedScore));
			const eloLoserChange = Math.round(kFactor * (0 - expectedScore));
			const newWinnerElo = winnerElo + eloWinnerChange;
			const newLoserElo = loserElo + eloLoserChange;
			await this.updateUserStatsOnEndGame(winnerId, true, newWinnerElo);
			await this.updateUserStatsOnEndGame(loserId, false, newLoserElo);
		} catch (error) {
			console.log(error);
		}
	}

	/* D(elete) */
	async deleteUserStats( userIdDto: UserIdDto ) {
		this.prisma.userStats.delete({
			where: { userId: userIdDto.userId },
		});
	}
}