import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ProveedorDtoCrear {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100, { message: 'El nombre no debe tener más de 100 caracteres' })
  nombre:string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15, { message: 'El telefono debe tener entre 10 y 15 caracteres' })
  @Matches(/^\d+$/, { message: 'El CBU solo puede contener dígitos numéricos' })
  telefono:string;
}