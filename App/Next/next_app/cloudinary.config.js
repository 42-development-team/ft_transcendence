import { Cloudinary } from "@cloudinary/url-gen";

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});