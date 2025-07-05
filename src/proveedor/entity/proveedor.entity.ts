import { Lista } from "src/lista/entity/lista.entity";
import { Producto } from "src/producto/entity/producto.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, Like, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length:'100'})
  nombre: string;

  @Column({type: 'varchar', length:'15'})
  telefono: string;
  
  @OneToMany(()=> Lista, lista=> lista.proveedor, {cascade:true})
  lista:Lista[];

  @ManyToMany(()=>Producto, producto=> producto.proveedor)
  @JoinTable({
    name: 'producto_proveedor',
    joinColumn:{
      name: 'proveedor_id',
      referencedColumnName:'id'
    },
    inverseJoinColumn:{
      name: 'producto_id',
      referencedColumnName:'id'
    }
  })
  producto:Producto[];

  @ManyToOne(()=>User, user=> user.proveedor)
  user:User;

}