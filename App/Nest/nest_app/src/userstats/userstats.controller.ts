import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserStatsService } from "./userstats.service";
import { UserIdDto } from "./dto/user-id.dto";
import { UserStatsDto } from "./dto/userstats.dto";

ApiTags('Userstats')
@Controller('userstats')
export class UserstatsController {
	constructor(private userstatsService: UserStatsService) { }

	/* C(reate) */
	@Post('create')
	async createUserStats(@Body() userIdDto: UserIdDto, @Res() response: any) {
		try {
			const newUserStats = await this.userstatsService.createUserStats(userIdDto);

			response.status(HttpStatus.CREATED);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* R(ead) */
	@Get('info/:userId')
	async getUserStats(@Param('userId') userId: string,  @Res() response: any) {
		try {
			const id: number = Number(userId);
			const statsDto = await this.userstatsService.getUserStats(id);

			console.log("stats READ in get:", statsDto)
			await response.status(HttpStatus.OK).send(JSON.stringify(statsDto));
		} catch (error) {
			await response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

	/* U(pdate) */
	@Patch('update/:id')
	async updateUserStats(@Param('id') id: number, @Body() userUpdateDto: UserStatsDto, @Res() response: any) {
		try {
			this.userstatsService.updateUserStats(id, userUpdateDto);

			response.status(HttpStatus.OK);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}


	/* D(elete) */
	@Delete('delete')
	async deleteUserStats(@Body() userIdDto: UserIdDto, @Res() response: any) {
		try {
			this.userstatsService.deleteUserStats(userIdDto);

			response.status(HttpStatus.OK);
		} catch (error) {
			response.status(HttpStatus.BAD_REQUEST).send(JSON.stringify(error.message));
		}
	}

}