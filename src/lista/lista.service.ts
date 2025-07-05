import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Lista } from './entity/lista.entity';
import { ListaDtoCrear } from './dto/listaCrear.dto';
import { ProveedorService } from 'src/proveedor/proveedor.service';
import { Proveedor } from 'src/proveedor/entity/proveedor.entity';
import { ListaDtoEditar } from './dto/listaEditar.dto';
import { ListaProducto } from 'src/lista-producto/entity/listaProducto.entity';
import { ListaProductoService } from 'src/lista-producto/lista-producto.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ListaService {
  constructor(
    @InjectRepository(Lista) private readonly listaRepository: Repository<Lista>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly proveedorService: ProveedorService,
    private readonly listaProductoService: ListaProductoService,
  ) { }

  async getLista(userId: string): Promise<Lista[]> {
    try {
      const criterio: FindManyOptions = {
        relations: ['proveedor'],
        where: {
          user: {
            id: userId
          }
        },
        order: {
          fecha: 'ASC'
        }
      }

      const lista: Lista[] = await this.listaRepository.find(criterio);

      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async getListaById(id: string, userId: string): Promise<Lista | null> {
    try {
      const criterio: FindOneOptions = {
        relations: ['proveedor', 'listaProducto.producto'],
        where: {
          id: id,
          user: {
            id: userId
          }
        }
      }

      const lista: Lista | null = await this.listaRepository.findOne(criterio);
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async getListaByFecha(fecha: Date, userId: string): Promise<Lista | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          fecha: fecha,
          user: {
            id: userId
          }
        }
      }

      const lista: Lista | null = await this.listaRepository.findOne(criterio);
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async getListaByIdOrFail(id: string, userId: string): Promise<Lista> {
    try {
      const lista: Lista | null = await this.getListaById(id, userId);
      if (!lista) throw new NotFoundException(`No existe lista con el id ${id}`)
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async createLista(dato: ListaDtoCrear, user: User): Promise<Lista> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {

      const proveedor: Proveedor = await this.proveedorService.getProveedorByIdOrFail(dato.proveedor, user.id);

      const listaProducto: ListaProducto[] = dato.listaProductos && dato.listaProductos.length > 0
        ? await this.listaProductoService.getOrCreateListaProductos(dato.listaProductos, qr, user)
        : [];

      const lista = new Lista()
      lista.fecha = dato.fecha;
      lista.proveedor = proveedor;
      lista.listaProductos = listaProducto
      lista.user = user;

      const newLista: Lista = qr
        ? await qr.manager.save(Lista, lista)
        : await this.listaRepository.save(lista);

      await qr.commitTransaction();

      return newLista;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato la lista`)
    } finally {
      await qr.release();
    }
  }

  async updateLista(id: string, dato: ListaDtoEditar, userId: string): Promise<Lista> {
    try {
      const lista: Lista = await this.getListaByIdOrFail(id, userId);

      const proveedor: Proveedor = dato && dato.proveedor
        ? await this.proveedorService.getProveedorByIdOrFail(dato.proveedor, userId)
        : lista.proveedor;

      const listaProducto: ListaProducto[] = dato.listaProductos && dato.listaProductos.length > 0
        ? await this.listaProductoService.updateListaProductos(dato.listaProductos, userId)
        : lista.listaProductos;

      lista.fecha = dato.fecha || lista.fecha;
      lista.proveedor = proveedor;
      lista.listaProductos = listaProducto;

      const newLista: Lista = await this.listaRepository.save(lista);
      return newLista;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato la lista`)
    }
  }

  async deleteLista(id: string, userId: string): Promise<boolean> {
    try {
      const lista: Lista = await this.getListaByIdOrFail(id, userId);

      await this.listaRepository.remove(lista)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato la lista`)
    }
  }

}
