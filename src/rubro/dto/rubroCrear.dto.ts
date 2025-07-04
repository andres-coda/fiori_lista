import { IsNotEmpty, IsString, Length } from "class-validator";

export class RubroDtoCrear{
  @IsNotEmpty()
  @IsString()
  @Length(1, 30, { message: 'El rubro no debe tener más de 30 caracteres' })
  rubro:string;
}