import { Lista } from "src/lista/entity/lista.entity";
import { Producto } from "src/producto/entity/producto.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('lista-producto')
export class ListaProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lista, lista => lista.listaProductos)
  lista: Lista;

  @ManyToOne(() => Producto, producto => producto.listaProductos)
  producto: Producto;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  cantidad: number;

  @ManyToOne(()=>User, user=> user.listaProducto)
  user:User;
}
