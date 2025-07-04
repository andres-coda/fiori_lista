import { Module } from '@nestjs/common';
import { ErroresService } from './errores.service';

@Module({
  providers: [ErroresService],
  exports: [ErroresService]
})
export class ErroresModule {}
