import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { deleteFile } from "../utils/helpers/delete-file";
import AppException from "./app-exception/app-exception";

@Catch(...[HttpException, AppException])
export class DeleteFileOnErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.statusCode;

    const fileField = request.file || request.files;
    if (fileField) {
      const filePaths = Array.isArray(fileField)
        ? (fileField.map((file) => file.path) as string[])
        : [fileField.path];

      filePaths.forEach(deleteFile);
    }

    response.status(status).json({
      statusCode: status,
      type:
        exception instanceof AppException ? "AppException" : "HttpException",
      message: exception.message,
    });
  }
}
