import { Controller, Post, UseInterceptors, InternalServerErrorException, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  /* @UseInterceptors decorator tells that the file field in the front form data 
  will be used to pass the uploaded file to this method (uploadAvatar) 
  It use the Multer middleware set up in main.ts to process the uploaded file. */ 
  async uploadAvatar(@UploadedFile() file: any) {
    /*  @UploadedFile() decorator tells NestJS that we want to access the uploaded file 
    in this method. 
    It's like a "getter" for the file that Multer processed. */ 
    try {
      // Upload the image to Cloudinary using the CloudinaryService
      const imageUrl = await this.cloudinaryService.uploadAvatar(file);

      // Optionally, you can save the imageUrl to your database or associate it with the user's information

      return { imageUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new InternalServerErrorException('Avatar upload failed');
    }
  }
}
