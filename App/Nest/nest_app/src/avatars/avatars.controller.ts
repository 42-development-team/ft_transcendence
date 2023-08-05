import { Controller, Post, UseInterceptors, InternalServerErrorException, UploadedFile, Logger, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/public.routes';
import { GetCurrentUserId } from '../common/custom-decorators/get-current-user-id.decorator';
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
    @GetCurrentUserId() userId: number,
  ) {
    try {
      this.logger.log('Received file in uploadAvatar controller:', file);

      if (!userId) {
        throw new UnauthorizedException('Missing JWT token');
      }

      // Upload the image to Cloudinary using the CloudinaryService
      const imageUrl = await this.cloudinaryService.uploadAvatar(file);

      // Associate the avatar with the authenticated user
      await this.usersService.updateAvatar(userId, imageUrl);

      this.logger.log('Avatar uploaded successfully.');
      return { imageUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      if (file?.path) {
        try {
          unlinkSync(file.path); // Remove the uploaded file from the filesystem
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError);
        }
      }
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }
}
