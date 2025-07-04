import { ListaProducto } from "src/lista-producto/entity/listaProducto.entity";
import { Producto } from "src/producto/entity/producto.entity";
import { Proveedor } from "src/proveedor/entity/proveedor.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Lista{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'date'})
  fecha:Date;

  @ManyToOne(()=>Proveedor, proveedor=> proveedor.lista)
  proveedor:Proveedor;

  @OneToMany(() => ListaProducto, lp => lp.lista, { cascade: true })
  listaProductos: ListaProducto[];
}
