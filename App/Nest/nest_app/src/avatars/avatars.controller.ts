import { Controller, Post, Param, Get, Body, BadRequestException, UseInterceptors, InternalServerErrorException, UploadedFile, Logger, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/public.routes';
// import { GetCurrentUserId } from '../common/custom-decorators/get-current-user-id.decorator';

@Controller('avatars')
export class AvatarsController {
  private readonly logger = new Logger(AvatarsController.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body('userID') userId: string,
  ) {
    try {
  
      if (!userId) {
        throw new UnauthorizedException('Missing user ID');
      }
  
      const userIdNumber = Number(userId);
  
      if (isNaN(userIdNumber) || !Number.isInteger(userIdNumber) || userIdNumber <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      const imageUrl = await this.cloudinaryService.uploadAvatar(file);
  
      await this.usersService.updateAvatar(userIdNumber, imageUrl);
  
      this.logger.log('Avatar uploaded successfully.');
      return { imageUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }

  @Public()
  @Get(":id")
  async getAvatar(@Param('id') id: string) {
    try {
      const userId = Number(id);
      if ( !userId ) {
        throw new BadRequestException('Invalid user ID');
      }
      const user = await this.usersService.getUserFromId(userId);
      const avatar = user.avatar;
      return { avatar };
    } catch (error) {
      console.error('Error getting avatar:', error);
      throw new InternalServerErrorException('Avatar get failed');
    }
  }
  
}

