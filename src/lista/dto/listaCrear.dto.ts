import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ListaDtoCrear {
  @IsNotEmpty()
  @IsDate()
  fecha:Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  proveedor:string;
}