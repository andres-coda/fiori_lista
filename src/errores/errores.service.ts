import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErroresService {
  public handleExceptions(error: any, customMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    } else if (error instanceof ConflictException) {
      throw new HttpException({ status: HttpStatus.CONFLICT, error: error.message }, HttpStatus.CONFLICT);
    } else {
      throw new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: `${customMessage}: ${error}` }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
