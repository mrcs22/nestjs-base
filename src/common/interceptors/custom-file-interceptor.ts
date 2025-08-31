import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
  BadRequestException,
  Type,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { Observable } from "rxjs";

export function CustomFileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    protected uploadInterceptor: NestInterceptor;

    constructor() {
      // Properly instantiate the uploadInterceptor
      const InterceptorClass = FileInterceptor(fieldName, localOptions);
      this.uploadInterceptor = new InterceptorClass();
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<Observable<any>> {
      // First, run the base FileInterceptor to handle file upload
      await this.uploadInterceptor.intercept(context, next);

      // Now, get the request object and parse the 'data' field
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();

      if (request.body && typeof request.body.data === "string") {
        try {
          request.body.data = JSON.parse(request.body.data);
        } catch (error) {
          throw new BadRequestException("Invalid JSON in data field");
        }
      }

      // Proceed to the next handler
      return next.handle();
    }
  }

  // Return the mixin class
  return mixin(MixinInterceptor);
}
