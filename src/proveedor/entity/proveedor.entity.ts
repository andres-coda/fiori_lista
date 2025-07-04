import { Lista } from "src/lista/entity/lista.entity";
import { Producto } from "src/producto/entity/producto.entity";
import { Column, Entity, Like, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length:'100'})
  nombre: string;

  @Column({type: 'varchar', length:'15'})
  telefono: string;

  @ManyToMany(()=>Producto, producto=> producto.proveedor)
  producto:Producto[];

  @OneToMany(()=> Lista, lista=> lista.proveedor, {cascade:true})
  lista:Lista[]
}