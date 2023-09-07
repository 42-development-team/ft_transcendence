import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private configService: ConfigService,
        ) {}

    catch(exception: unknown, host: ArgumentsHost): void {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.clearCookie("jwt");
        response.clearCookie("rt");
        response.redirect(`http://${this.configService.get<string>('ip')}:${this.configService.get<string>('frontPort')}/`);
    }
}
