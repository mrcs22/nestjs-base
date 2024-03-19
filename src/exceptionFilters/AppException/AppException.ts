import { HttpStatus } from '@nestjs/common';

class AppException extends Error {
  public readonly statusCode: HttpStatus;

  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(message);

    this.statusCode = statusCode;
  }
}

export default AppException;
