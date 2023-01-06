import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      // @ts-expect-error in case of error
      if (typeof exceptionResponse === 'object' && exceptionResponse.__error__) {
        return response.status(status).json(exceptionResponse);
      }
    }

    // @ts-expect-error in case of error
    const message = exception.message.message || exception.message || 'Internal server error';

    return response.status(status).json({ __error__: message });
  }
}
