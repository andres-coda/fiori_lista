import { Lista } from "src/lista/entity/lista.entity";
import { Producto } from "src/producto/entity/producto.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ListaProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lista, lista => lista.listaProductos)
  lista: Lista;

  @ManyToOne(() => Producto, producto => producto.listaProductos)
  producto: Producto;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  cantidad: number;
}
