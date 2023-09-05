import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/public.routes';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Initialize Cloudinary with the data stored in the .env file
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  @Public()
  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    try {
      // Convert the Buffer to a base64 string
      const base64String = file.buffer.toString('base64');

      // Upload the image passed by the controller uploadAvatar method
      // to Cloudinary and get the image URL
      const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64String}`, {
      });
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading avatar to Cloudinary:', error);
      throw new Error('Failed to upload avatar to Cloudinary');
    }
  }
}
