import { PrismaService } from "src/prisma/prisma.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";
import { stat } from "fs";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { GameService } from "src/game/game.service";
import { GameUserDto } from "src/game/dto/game-user.dto";
import { GetGameDto } from "src/game/dto/get-game.dto";

@Injectable()
export class UserStatsService {
	constructor(
		private prisma: PrismaService,
		@Inject(forwardRef(() => GameService))
		 private gameService: GameService
		 ) {}

	/* C(reate) */
	async createUserStats( userIdDto: UserIdDto ) {
		const stats = await this.prisma.userStats.findUnique({
			where:  { userId: userIdDto.userId },
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
			avatar: user.avatar,
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

		statsDto.avatar = user.avatar;
		statsDto.winStreak = user.userStats.winStreak;
		statsDto.win = user.userStats.win;
		statsDto.lose = user.userStats.lose;
		statsDto.totalScore = user.userStats.totalScore;
		statsDto.ratio = user.userStats.ratio;
		statsDto.played = user.userStats.played;
		
		return statsDto;
	}

	async creteUserStatsIfNotExists( user: any ) {
		if (user.userStats === undefined || !user.userStats) {
			const newUserStats = await this.createUserStats({ userId: user.id });
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
		}
		user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: user.id },
		});
		return user;
	}

	async getLeaderBoard(userId: number) : Promise<UserStatsDto[]>{
		const user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		const username = user.username;
		await this.creteUserStatsIfNotExists(user);
		const leaderBoard = await this.prisma.userStats.findMany({
			include: { user: true },
			orderBy: { totalScore: 'desc' },
		});
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
					ratio: Number((userUpdateDto.win / userUpdateDto.played).toFixed(1)),
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
			user = await this.creteUserStatsIfNotExists(user);
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
					ratio: Number(((user.userStats.win + win) / (user.userStats.played + 1)).toFixed(1)),
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
			winner = await this.creteUserStatsIfNotExists(winner);
			loser = await this.creteUserStatsIfNotExists(loser);

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