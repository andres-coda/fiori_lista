import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { ListaProducto } from './entity/listaProducto.entity';
import { ListaProductoDtoCrear } from './dto/listaProductoCrear.dto';
import { ProductoService } from 'src/producto/producto.service';
import { Producto } from 'src/producto/entity/producto.entity';
import { ListaProductoDtoEditar } from './dto/listaProductoEditar.dto';
import { ListaProductoDtoEditarArray } from './dto/listaProductoEditarArray.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ListaProductoService {
  constructor(
    @InjectRepository(ListaProducto) private readonly listaProductoRepository: Repository<ListaProducto>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly productoService: ProductoService,
  ) { }

  async getListaProducto(userId:string): Promise<ListaProducto[]> {
    try {
      const criterio: FindManyOptions = {
        where:{
          user:{
            id:userId
          }
        }
      }

      const listaProducto: ListaProducto[] = await this.listaProductoRepository.find(criterio);

      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async getListaProductoById(id: string, userId:string): Promise<ListaProducto | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
          user:{
            id:userId
          }
        }
      }

      const listaProducto: ListaProducto | null = await this.listaProductoRepository.findOne(criterio);
      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async getListaProductoByIdOrFail(id: string, userId:string): Promise<ListaProducto> {
    try {
      const listaProducto: ListaProducto | null = await this.getListaProductoById(id, userId);
      if (!listaProducto) throw new NotFoundException(`No existe la lista con cantidad de productos con el id ${id}`)
      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async createListaProducto(dato: ListaProductoDtoCrear, user:User, qr?: QueryRunner): Promise<ListaProducto> {
    try {
      const producto: Producto = await this.productoService.getProductoByIdOrFail(dato.producto);

      const listaProducto = new ListaProducto()
      listaProducto.cantidad = dato.cantidad;
      listaProducto.producto = producto;
      listaProducto.user = user;

      const newListaProducto: ListaProducto = qr
        ? await qr.manager.save(ListaProducto, listaProducto)
        : await this.listaProductoRepository.save(listaProducto);

      return newListaProducto;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de la lista con cantidad de productos`)
    } 
  }

  async getOrCreateListaProducto(dato: ListaProductoDtoEditar, qr: QueryRunner, user:User): Promise<ListaProducto> {
    if (!dato) throw new NotFoundException('No tiene datos para crear o buscar el producto de lista');
    if (dato.id) return await this.getListaProductoByIdOrFail(dato.id, user.id);
    if (dato.producto && dato.cantidad) return await this.createListaProducto({
      producto: dato.producto,
      cantidad: dato.cantidad
    }, user, qr);
    throw new BadRequestException('Faltan datos para obtener o crear el producto de lista');
  }

  addListaProductosUnicos(listaProductosExistentes: ListaProducto[], listaProductosNuevos: ListaProducto[]): ListaProducto[] {
    const productosExistentesIds = new Set(listaProductosExistentes.map(p => p.id));
    const productosUnicos: ListaProducto[] = listaProductosNuevos.filter(p => !productosExistentesIds.has(p.id));
    return [...listaProductosExistentes, ...productosUnicos]
  }

  subProductos(listaProductosExistentes: ListaProducto[], listaProductosQuitar: ListaProducto[]): ListaProducto[] {
    const listaProductosQuitarIds = new Set(listaProductosQuitar.map(p => p.id));

    const listaProductosFiltrados = listaProductosExistentes.filter(p => !listaProductosQuitarIds.has(p.id));
    return listaProductosFiltrados;
  }

  async getOrCreateListaProductos(dato: ListaProductoDtoEditar[], qr: QueryRunner, user:User): Promise<ListaProducto[]> {
    if (dato.length == 0) return [];
    const listaProductos: ListaProducto[] = await Promise.all(
      dato.map((d) => this.getOrCreateListaProducto(d, qr, user))
    );
    return listaProductos;
  }

  async updateListaProducto(id: string, dato: ListaProductoDtoEditarArray, userId:string): Promise<ListaProducto> {
    try {
      const listaProducto: ListaProducto = await this.getListaProductoByIdOrFail(id, userId);
      const producto: Producto = dato.producto
        ? await this.productoService.getProductoByIdOrFail(dato.producto)
        : listaProducto.producto;

      listaProducto.cantidad = dato.cantidad || listaProducto.cantidad;
      listaProducto.producto = producto;

      const newListaProducto: ListaProducto = await this.listaProductoRepository.save(listaProducto);
      return newListaProducto;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de la lista con cantidad de productos`)
    }
  }

  async updateListaProductos(datos: ListaProductoDtoEditarArray[], userId:string): Promise<ListaProducto[]> {
    if (datos.length == 0) return [];
    const listaProducto: ListaProducto[] = await Promise.all(
      datos.map((lp: ListaProductoDtoEditarArray) => this.updateListaProducto(lp.id, lp, userId))
    );
    return listaProducto;
  }

  async deleteListaProducto(id: string, userId:string): Promise<boolean> {
    try {
      const listaProducto: ListaProducto = await this.getListaProductoByIdOrFail(id, userId);

      await this.listaProductoRepository.remove(listaProducto)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de la lista con cantidad de productos`)
    }
  }

}
