import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsUUID, Max, Min } from "class-validator";

export class ListaProductoDtoEditar {
  @IsOptional()
  @IsUUID()
  producto?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La cantidad debe tener como máximo 2 decimales' })
  @Min(0.01, { message: 'La cantidad mínima debe ser 0.01' })
  @Max(99.99, { message: 'La cantidad máxima debe ser 99.99' })
  cantidad?: number;
}