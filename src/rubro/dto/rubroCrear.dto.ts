import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { ProductoDtoEditar } from "src/producto/dto/productoEditar.dto";

export class RubroDtoCrear {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30, { message: 'El rubro no debe tener más de 30 caracteres' })
  rubro: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe especificar al menos un producto' })
  @Type(() => ProductoDtoEditar)
  productos?: ProductoDtoEditar[];
}