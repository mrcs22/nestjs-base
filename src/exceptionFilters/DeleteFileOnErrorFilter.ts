import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { deleteFile } from '../utils/helpers/deleteFile';

@Catch(HttpException)
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const getFileField = () => request.file || request.files;

    const fileField = getFileField();

    if (fileField) {
      const filePaths = Array.isArray(fileField)
        ? (fileField.map((file) => file.path) as string[])
        : [fileField.path];

      filePaths.forEach(deleteFile);
    }

    response.status(status).json(exception.getResponse());
  }
}
