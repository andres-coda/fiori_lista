import { IsOptional, IsString, IsUUID, Length } from "class-validator";
import { ProductoDtoValido } from "./productoDtoValido.dto";

export class ProductoDtoEditar {
  @IsOptional()
  @IsUUID()
  id?:string;

  @IsOptional()
  @IsString()
  @Length(1, 30, { message: 'El nombre no debe tener más de 30 caracteres' })
  producto?:string;

  @ProductoDtoValido({ message: 'Cada producto debe tener un ID o un nombre y un rubro' })
  validarProducto: boolean;
}