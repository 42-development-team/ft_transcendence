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

			this.logger.log("newUserStats CREATE:", newUserStats)
			await response.status(HttpStatus.CREATED);
		} catch (error) {
			this.logger.log("newUserStats CREATE error:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* R(ead) */
	@Get('info/:userId')
	async getUserStats(@Param('userId') userId: string,  @Res() response: any) {
		try {
			const id: number = Number(userId);
			const statsDto = await this.userstatsService.getUserStats(id);

			this.logger.log("statsDto READ:", statsDto)
			await response.status(HttpStatus.OK).send(JSON.stringify(statsDto));
		} catch (error) {
			this.logger.log("statsDto READ error:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* U(pdate) */
	@Patch('update/:id')
	async updateUserStats(@Param('id') id: number, @Body() userUpdateDto: UserStatsDto, @Res() response: any) {
		try {
			this.userstatsService.updateUserStats(id, userUpdateDto);

			this.logger.log("statsDto UPDATE:", userUpdateDto)
			await response.status(HttpStatus.OK);
		} catch (error) {
			this.logger.log("statsDto UPDATE error:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}


	/* D(elete) */
	@Delete('delete')
	async deleteUserStats(@Body() userIdDto: UserIdDto, @Res() response: any) {
		try {
			this.userstatsService.deleteUserStats(userIdDto);

			this.logger.log("statsDto DELETE:", userIdDto)
			await response.status(HttpStatus.OK);
		} catch (error) {
			this.logger.log("statsDto DELETE error:", error.message)
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

}