import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class RubroDtoEditar{
  @IsOptional()
  @IsUUID()
  id?:string;

  @IsOptional()
  @IsString()
  @Length(1, 30, { message: 'El rubro no debe tener más de 30 caracteres' })
  rubro?:string;
}