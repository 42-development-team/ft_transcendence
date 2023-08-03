import { Controller, Req, Post, UseInterceptors, InternalServerErrorException, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';
import { Public } from '../auth/public.routes';

@Controller('avatars')
export class AvatarsController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  /* @UseInterceptors decorator tells that the file field in the front form data 
  will be used to pass the uploaded file to this method (uploadAvatar) 
  It use the Multer middleware set up in main.ts to process the uploaded file. */ 
  async uploadAvatar(@UploadedFile() file: any, @Req() req: any) {
    /*  @UploadedFile() decorator tells NestJS that we want to access the uploaded file 
    in this method. 
    It's like a "getter" for the file that Multer processed. */ 
    try {
      console.log('Uploading avatar...');
      // Upload the image to Cloudinary using the CloudinaryService
      const imageUrl = await this.cloudinaryService.uploadAvatar(file);

      // Check if the user is authenticated (i.e., has a JWT token)
      if (req.user) {
        // User is authenticated, associate the avatar with the authenticated user
        const userId = req.user.sub;
        await this.usersService.updateAvatar(userId, imageUrl);
      } else {
        // req.session.avatarUrl = imageUrl; // Set avatarUrl on req.session
        if (req.session) {
          req.session.avatarUrl = imageUrl; // Set avatarUrl on req.session
        } else {
          // If req.session is undefined, you can consider logging an error or handling it differently
          console.error('req.session is not defined');
        }
      }

      console.log('Avatar uploaded successfully.');
      return { imageUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }
}
