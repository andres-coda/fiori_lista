import { Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ListaProductoDtoEditar } from "src/lista-producto/dto/listaProductoEditar.dto";

export class ListaDtoCrear {
  @IsNotEmpty()
  @IsDate()
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  proveedor: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe especificar al menos un producto de lista' })
  @Type(() => ListaProductoDtoEditar)
  listaProductos?: ListaProductoDtoEditar[];
}