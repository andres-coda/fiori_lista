import { Role } from "src/auth/rol/rol.enum";
import { ListaProducto } from "src/lista-producto/entity/listaProducto.entity";
import { Lista } from "src/lista/entity/lista.entity";
import { Proveedor } from "src/proveedor/entity/proveedor.entity";
import { Rubro } from "src/rubro/entity/rubro.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, OneToMany } from "typeorm";

@Entity('user')
@Unique(['telefono', 'email'])
export class User{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type: 'varchar', length: 100})
  nombre:string;

  @Column({type: 'varchar', length: 256})
  email:string;

  @Column({type: 'varchar', length: 20})
  clave:string;

  @Column({type: 'varchar', length: 15})
  telefono:string;

  @Column({default:Role.User})
  role:Role

  @OneToMany(()=>Rubro, rubro=> rubro.user, {cascade:true})
  rubro: Rubro[];

  @OneToMany(()=>Proveedor, proveedor=> proveedor.user, {cascade:true})
  proveedor: Proveedor[];

  @OneToMany(()=>Lista, lista=> lista.user, {cascade:true})
  lista: Lista[];

  @OneToMany(()=>ListaProducto, listaProducto=> listaProducto.user, {cascade:true})
  listaProducto: ListaProducto[];
}