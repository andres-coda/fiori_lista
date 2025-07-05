import { Producto } from "src/producto/entity/producto.entity";
import { User } from "src/user/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

@Entity('rubro')
export class Rubro {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'varchar', length:'30'})
  rubro:string;

  @OneToMany(()=> Producto, producto=> producto.rubro, {cascade: true})
  producto:Producto[];

  @ManyToOne(()=>User, user=> user.rubro)
  user:User;
}