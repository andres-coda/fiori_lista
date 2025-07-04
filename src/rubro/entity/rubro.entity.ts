import { Producto } from "src/producto/entity/producto.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Rubro {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'varchar', length:'30'})
  rubro:string;

  @ManyToOne(()=> Producto, producto=> producto.rubro)
  producto:Producto[];
}