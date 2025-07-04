import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { ListaProducto } from './entity/listaProducto.entity';
import { ListaProductoDtoCrear } from './dto/listaProductoCrear.dto';
import { ProductoService } from 'src/producto/producto.service';
import { ListaService } from 'src/lista/lista.service';
import { Lista } from 'src/lista/entity/lista.entity';
import { Producto } from 'src/producto/entity/producto.entity';
import { ListaProductoDtoEditar } from './dto/listaProductoEditar.dto';
import { ListaProductoDtoEditarArray } from './dto/listaProductoEditarArray.dto';

@Injectable()
export class ListaProductoService {
  constructor(
    @InjectRepository(ListaProducto) private readonly listaProductoRepository: Repository<ListaProducto>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly productoService: ProductoService,
    private readonly listaService: ListaService
  ) { }

  async getListaProducto(): Promise<ListaProducto[]> {
    try {
      const criterio: FindManyOptions = {}

      const listaProducto: ListaProducto[] = await this.listaProductoRepository.find(criterio);

      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async getListaProductoById(id: string): Promise<ListaProducto | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id
        }
      }

      const listaProducto: ListaProducto | null = await this.listaProductoRepository.findOne(criterio);
      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async getListaProductoByIdOrFail(id: string): Promise<ListaProducto> {
    try {
      const listaProducto: ListaProducto | null = await this.getListaProductoById(id);
      if (!listaProducto) throw new NotFoundException(`No existe la lista con cantidad de productos con el id ${id}`)
      return listaProducto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista con cantidad de productos`)
    }
  }

  async createListaProducto(dato: ListaProductoDtoCrear): Promise<ListaProducto> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const lista: Lista = await this.listaService.getOrCreateLista(dato.lista, qr);
      const producto: Producto = await this.productoService.getProductoByIdOrFail(dato.producto);

      const listaProducto = new ListaProducto()
      listaProducto.cantidad = dato.cantidad;
      listaProducto.lista = lista;
      listaProducto.producto = producto;

      const newListaProducto: ListaProducto = await qr.manager.save(ListaProducto, listaProducto);
      await qr.commitTransaction();

      return newListaProducto;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de la lista con cantidad de productos`)
    } finally {
      await qr.release();
    }
  }

  async updateListaProducto(id: string, dato: ListaProductoDtoEditar): Promise<ListaProducto> {
    try {
      const listaProducto: ListaProducto = await this.getListaProductoByIdOrFail(id);
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

  async updateListaProductos(datos: ListaProductoDtoEditarArray[]): Promise<ListaProducto[]> {
    if (datos.length == 0) return [];
    const listaProducto: ListaProducto[] = await Promise.all(
      datos.map((lp: ListaProductoDtoEditarArray) => this.updateListaProducto(
        lp.id,
        {
          producto: lp.producto,
          cantidad: lp.cantidad
        }
      ))
    );
    return listaProducto;
  }

  async deleteListaProducto(id: string): Promise<boolean> {
    try {
      const listaProducto: ListaProducto = await this.getListaProductoByIdOrFail(id);

      await this.listaProductoRepository.remove(listaProducto)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de la lista con cantidad de productos`)
    }
  }

}
