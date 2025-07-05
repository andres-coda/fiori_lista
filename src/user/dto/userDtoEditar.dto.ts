import { IsOptional, IsString, Length, Matches } from "class-validator";

export class UserDtoEditar {
  @IsOptional()
  @IsString()
  @Length(1, 30, { message: 'El nombre no debe tener más de 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(6, 20, { message: 'La clave debe tener entre 6 y 20 caracteres' })
  clave?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15, { message: 'El telefono debe tener entre 10 y 15 caracteres' })
  @Matches(/^\d+$/, { message: 'El CBU solo puede contener dígitos numéricos' })
  telefono?: string;
}