import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserStatsService } from "./userstats.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";

ApiTags('Userstats')
@Controller('userstats')
export class UserstatsController {
	constructor(private userstatsService: UserStatsService) { }

	logger = new Logger ('GameController');

	/* C(reate) */
	@Post('create')
	async createUserStats(@Body() userIdDto: UserIdDto, @Res() response: any) {
		try {
			const newUserStats = await this.userstatsService.createUserStats(userIdDto);

			this.logger.log("Successfully created userStats:", newUserStats)
			await response.status(HttpStatus.CREATED);
		} catch (error) {
			this.logger.log("Failed to create userStats:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* R(ead) */
	@Get('info/:userId')
	async getUserStats(@Param('userId') userId: string,  @Res() response: any) {
		try {
			const id: number = Number(userId);
			const statsDto = await this.userstatsService.getUserStats(id);

			this.logger.log("Successfully get userStats:", statsDto)
			await response.status(HttpStatus.OK).send(JSON.stringify(statsDto));
		} catch (error) {
			this.logger.log("Failed to get userStats:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	@Get('info/leaderBoard/:userId')
	async getLeaderBoard(@Param('userId') userId: string, @Res() response: any) {
		try {
			const id = Number(userId);
			const leaderBoard = await this.userstatsService.getLeaderBoard(id);

			this.logger.log("Successfully get leaderBoard:", leaderBoard)
			await response.status(HttpStatus.OK).send(JSON.stringify(leaderBoard));
		} catch (error) {
			this.logger.log("Failed to get userStats:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}


	/* U(pdate) */
	@Patch('update/:id')
	async updateUserStats(@Param('id') id: number, @Body() userUpdateDto: UserStatsDto, @Res() response: any) {
		try {
			this.userstatsService.updateUserStats(id, userUpdateDto);

			this.logger.log("Successfully updated userStats:", userUpdateDto)
			await response.status(HttpStatus.OK);
		} catch (error) {
			this.logger.log("Failed to update userStats:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}


	/* D(elete) */
	@Delete('delete')
	async deleteUserStats(@Body() userIdDto: UserIdDto, @Res() response: any) {
		try {
			this.userstatsService.deleteUserStats(userIdDto);

			this.logger.log("Successfully deleted userStats:", userIdDto)
			await response.status(HttpStatus.OK);
		} catch (error) {
			this.logger.log("Failed to delete userStats:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

}