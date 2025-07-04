import { Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ListaProductoDtoEditarArray } from "src/lista-producto/dto/listaProductoEditarArray.dto";

export class ListaDtoEditar {
  @IsOptional()
  @IsString()
  @IsUUID()
  id?:string;
  
  @IsOptional()
  @IsDate()
  fecha?:Date;

  @IsOptional()
  @IsString()
  @IsUUID()
  proveedor?:string;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe especificar al menos un producto en la lista' })
  @Type(() => ListaProductoDtoEditarArray)
  listaProductos?:ListaProductoDtoEditarArray[];

}