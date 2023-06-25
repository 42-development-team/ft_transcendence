import { NestInterceptor, Type } from '@nestjs/common';
import { MulterOptions } from '../interfaces/multer-options.interface';
export declare function NoFilesInterceptor(localOptions?: MulterOptions): Type<NestInterceptor>;
