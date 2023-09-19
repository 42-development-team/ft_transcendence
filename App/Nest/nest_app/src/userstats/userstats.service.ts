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

	async getLeaderBoard(userId: number) : Promise<UserStatsDto[]>{
		const user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		const username = user.username;
		if (user.userStats === undefined || !user.userStats) {
			const newUserStats = await this.createUserStats({ userId: userId });
			if (!newUserStats) {
				throw new Error("UserStats Creation failed");
			}
		}
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

	async updateUserStatsOnEndGame( userId: number, userUpdateDto: UserStatsDto ) {
		let user = await this.prisma.user.findUniqueOrThrow({
			include: { userStats: true },
			where: { id: userId },
		});
		if (user.userStats === undefined || !user.userStats) {
			const newUserStats = await this.createUserStats({ userId: userId });
			if ( !newUserStats ) {
				throw new Error("UserStats Creation failed");
			}
			user = await this.prisma.user.findUniqueOrThrow({
				include: { userStats: true },
				where: { id: userId },
			});
		}
		const updatedStats = await this.prisma.userStats.update({
			include: { user: true},
			where: { userId: user.id },
			data: { 
					winStreak: user.userStats.winStreak + userUpdateDto.winStreak,
					win: user.userStats.win + userUpdateDto.win,
					lose: user.userStats.lose + userUpdateDto.lose,
					totalScore: user.userStats.totalScore + userUpdateDto.totalScore,
					ratio: Number(((user.userStats.win + userUpdateDto.win) / (user.userStats.played + userUpdateDto.played)).toFixed(1)),
					played: user.userStats.played + userUpdateDto.played,
			},
		});
	}

	async updateUserStatsFromAllGames( userId: number ) {
		try {
			const games: GetGameDto[] = await this.gameService.getGamesAsc(userId);
			let user = await this.prisma.user.findUniqueOrThrow({
				include: { userStats: true },
				where: { id: userId },
			});
			if (user.userStats === undefined || !user.userStats) {
				const newUserStats = await this.createUserStats({ userId: userId });
				if ( !newUserStats ) {
					throw new Error("UserStats Creation failed");
				}
				user = await this.prisma.user.findUniqueOrThrow({
					include: { userStats: true },
					where: { id: userId },
				});
			}

			let updateStatsDto: UserStatsDto = {
				userId: userId,
				winStreak: user.userStats.winStreak,
				win: 0,
				lose: 0,
				totalScore: 0,
				ratio: 0,
				played: 0,
				userName: user.username,
				avatar: user.avatar,
			}
			let i: number = 0;
			let gamesLenght = games.length;
			for( let game of games ) {
				if ( game.winner.id === userId ) {
					updateStatsDto.win++;
					updateStatsDto.played++;
					updateStatsDto.totalScore += Math.max(100 - updateStatsDto.totalScore / 100, 20);
					if ( i == gamesLenght - 1 ) {
						updateStatsDto.winStreak++;
					}
			} else {
					updateStatsDto.lose++;
					updateStatsDto.played++;
					if ( i != 0 && updateStatsDto.totalScore >= 100 )
						updateStatsDto.totalScore -= 100;
					else
						updateStatsDto.totalScore = 0;
					if ( i == gamesLenght - 1 ) {
						updateStatsDto.winStreak = 0;
					}
				}
				i++;
			}
			updateStatsDto.ratio = Number((updateStatsDto.win / updateStatsDto.played).toFixed(1));
			await this.updateUserStats(userId, updateStatsDto);
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