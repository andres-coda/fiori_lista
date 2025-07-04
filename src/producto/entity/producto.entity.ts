import { ListaProducto } from "src/lista-producto/entity/listaProducto.entity";
import { Lista } from "src/lista/entity/lista.entity";
import { Proveedor } from "src/proveedor/entity/proveedor.entity";
import { Rubro } from "src/rubro/entity/rubro.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type: 'varchar', length:30})
  producto:string;

  @OneToMany(()=>Rubro, rubro => rubro.producto, {cascade:true})
  rubro:Rubro;

  @OneToMany(() => ListaProducto, lp => lp.producto)
  listaProductos: ListaProducto[];

  @ManyToMany(()=>Proveedor, proveedor => proveedor.producto)
  @JoinTable({
    name: 'producto_proveedor',
    joinColumn:{
      name: 'producto_id',
      referencedColumnName:'id'
    },
    inverseJoinColumn:{
      name: 'proveedor_id',
      referencedColumnName:'id'
    }
  })
  proveedor: Proveedor[];
}