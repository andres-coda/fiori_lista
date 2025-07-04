import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsString, Length, ValidateNested } from "class-validator";
import { ProveedorDtoEditar } from "src/proveedor/dto/proveedorEditar.dto";
import { RubroDtoValido } from "src/rubro/dto/rubroDtoValido.dto";
import { RubroDtoEditar } from "src/rubro/dto/rubroEditar.dto";

export class ProductoDtoCrear {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30, { message: 'El nombre no debe tener más de 30 caracteres' })
  producto:string;

  @ValidateNested()
  @Type(()=>RubroDtoEditar)
  @RubroDtoValido({ message: 'Debe proporcionar un ID de rubro existente o un nombre de rubro nuevo' })
  rubro:RubroDtoEditar;

  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe especificar al menos un proveedor' })
  @Type(() => ProveedorDtoEditar)
  proveedor: ProveedorDtoEditar[];
}