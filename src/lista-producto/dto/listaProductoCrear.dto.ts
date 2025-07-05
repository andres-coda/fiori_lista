import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID, Max, Min, ValidateNested } from "class-validator";
import { ListaDtoValido } from "src/lista/dto/listaDtoValido.dto";
import { ListaDtoEditar } from "src/lista/dto/listaEditar.dto";

export class ListaProductoDtoCrear {
  @IsNotEmpty()
  @IsUUID()
  producto: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La cantidad debe tener como máximo 2 decimales' })
  @Min(0.01, { message: 'La cantidad mínima debe ser 0.01' })
  @Max(9999.99, { message: 'La cantidad máxima debe ser 99.99' })
  cantidad: number;

  
}