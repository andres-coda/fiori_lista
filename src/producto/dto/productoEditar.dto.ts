import { Type } from "class-transformer";
import { ArrayMinSize, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { ProveedorDtoEditar } from "src/proveedor/dto/proveedorEditar.dto";
import { RubroDtoValido } from "src/rubro/dto/rubroDtoValido.dto";
import { RubroDtoEditar } from "src/rubro/dto/rubroEditar.dto";

export class ProductoDtoEditar {
  @IsOptional()
  @IsString()
  @Length(1, 30, { message: 'El nombre no debe tener más de 30 caracteres' })
  producto?:string;

  @IsOptional()
  @ValidateNested()
  @Type(()=>RubroDtoEditar)
  @RubroDtoValido({ message: 'Debe proporcionar un ID de rubro existente o un nombre de rubro nuevo' })
  rubro?:RubroDtoEditar;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe especificar al menos un proveedor' })
  @Type(() => ProveedorDtoEditar)
  proveedor?: ProveedorDtoEditar[];
}