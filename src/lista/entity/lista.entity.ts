import { ListaProducto } from "src/lista-producto/entity/listaProducto.entity";
import { Proveedor } from "src/proveedor/entity/proveedor.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('lista')
export class Lista{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'date'})
  fecha:Date;

  @ManyToOne(()=>Proveedor, proveedor=> proveedor.lista)
  proveedor:Proveedor;

  @OneToMany(() => ListaProducto, lp => lp.lista, { cascade: true })
  listaProductos: ListaProducto[];

  @ManyToOne(()=>User, user=> user.lista)
  user:User;
}
