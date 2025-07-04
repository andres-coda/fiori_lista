import { IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";
import { ProveedorDtoValido } from "./proveedorDtoValido.dto";

export class ProveedorDtoEditar {
  @IsOptional()
  @IsUUID()
  id?:string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'El nombre no debe tener más de 100 caracteres' })
  nombre?:string;

  @IsOptional()
  @IsString()
  @Length(10, 15, { message: 'El telefono debe tener entre 10 y 15 caracteres' })
  @Matches(/^\d+$/, { message: 'El CBU solo puede contener dígitos numéricos' })
  telefono?:string;

  @ProveedorDtoValido({ message: 'Cada proveedor debe tener un ID o un nombre y un teléfono válidos' })
  validarProveedor: boolean;
}