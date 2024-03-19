import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import AppException from './AppException';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (err instanceof AppException) {
      return response.status(err.statusCode).json({
        status: err.statusCode,
        type: 'AppException',
        message: err.message,
      });
    }

    if (err instanceof HttpException) {
      const { statusCode, message } = err.getResponse() as {
        statusCode: number;
        message: string | string[] | undefined;
      };

      return response.status(err.getStatus()).json({
        status: statusCode,
        type: err.name,
        message:
          typeof message === 'string'
            ? message
            : Array.isArray(message)
              ? message.join('; ')
              : err.name,
      });
    }

    console.error(err);
    response.status(500).json({
      status: err.statusCode,
      statusCode: 500,
      message: 'Erro interno do servidor.',
    });
  }
}
