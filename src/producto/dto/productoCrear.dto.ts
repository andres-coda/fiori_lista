import { IsNotEmpty, IsString, Length } from "class-validator";

export class ProductoDtoCrear {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30, { message: 'El nombre no debe tener más de 30 caracteres' })
  producto:string;
}