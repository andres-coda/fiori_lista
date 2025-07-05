import { ListaProducto } from "src/lista-producto/entity/listaProducto.entity";
import { Proveedor } from "src/proveedor/entity/proveedor.entity";
import { Rubro } from "src/rubro/entity/rubro.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('producto')
export class Producto{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type: 'varchar', length:30})
  producto:string;

  @ManyToOne(()=>Rubro, rubro => rubro.producto)
  rubro:Rubro;

  @OneToMany(() => ListaProducto, lp => lp.producto)
  listaProductos: ListaProducto[];

  @ManyToMany(()=>Proveedor, proveedor => proveedor.producto)
  proveedor: Proveedor[];
}