import { Controller, Post, Body, BadRequestException, UseInterceptors, InternalServerErrorException, UploadedFile, Logger, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/public.routes';
// import { GetCurrentUserId } from '../common/custom-decorators/get-current-user-id.decorator';
import { unlinkSync } from 'fs';

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
    @Body('userID') userId: string, // Accept userId from the request body as a string
  ) {
    try {
  
      if (!userId) {
        throw new UnauthorizedException('Missing user ID');
      }
  
      const userIdNumber = Number(userId);
  
      // Check if the userIdNumber is valid
      if (isNaN(userIdNumber) || !Number.isInteger(userIdNumber) || userIdNumber <= 0) {
        throw new BadRequestException('Invalid user ID');
      }
  
      // Upload the image to Cloudinary
      const imageUrl = await this.cloudinaryService.uploadAvatar(file);
  
      // Associate the avatar with the authenticated user
      await this.usersService.updateAvatar(userIdNumber, imageUrl);
  
      this.logger.log('Avatar uploaded successfully.');
      return { imageUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }
  
}

