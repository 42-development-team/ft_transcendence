import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Initialize Cloudinary with the data we stored in the .env file
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAvatar(file: any): Promise<string> {
    try {
      // Upload the image passed by the controller uploadAvatar method
      // to Cloudinary and get the image URL
      const result = await cloudinary.uploader.upload(file.path);

      return result.secure_url;
    } catch (error) {
      throw new Error('Failed to upload avatar to Cloudinary');
    }
  }
}
