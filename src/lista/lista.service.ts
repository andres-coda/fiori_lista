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

@Injectable()
export class ListaService { 
  constructor(
    @InjectRepository(Lista) private readonly listaRepository: Repository<Lista>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly proveedorService: ProveedorService,
    private readonly listaProductoService: ListaProductoService,
  ) { }

  async getLista(): Promise<Lista[]> {
    try {
      const criterio: FindManyOptions = {
        relations:['proveedor'],
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

  async getListaById(id: string): Promise<Lista | null> {
    try {
      const criterio: FindOneOptions = {
        relations:['proveedor', 'listaProducto.producto'],
        where: {
          id: id
        }
      }

      const lista: Lista | null = await this.listaRepository.findOne(criterio);
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async getListaByFecha(fecha: Date): Promise<Lista | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          fecha: fecha
        }
      }

      const lista: Lista | null = await this.listaRepository.findOne(criterio);
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async getListaByIdOrFail(id: string): Promise<Lista> {
    try {
      const lista: Lista | null = await this.getListaById(id);
      if (!lista) throw new NotFoundException(`No existe lista con el id ${id}`)
      return lista;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de la lista`)
    }
  }

  async createLista(dato: ListaDtoCrear, qr?: QueryRunner): Promise<Lista> {
    try {

      const proveedor: Proveedor = await this.proveedorService.getProveedorByIdOrFail(dato.proveedor);

      const lista = new Lista()
      lista.fecha = dato.fecha;
      lista.proveedor = proveedor;

      const newLista: Lista = qr
        ? await qr.manager.save(Lista, lista)
        : await this.listaRepository.save(lista);

      return newLista;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato la lista`)
    }
  }

  async getOrCreateLista(dato: ListaDtoEditar, qr: QueryRunner): Promise<Lista> {
    if (!dato) throw new NotFoundException('No tiene datos para crear o buscar lista');
    if (dato.id) return await this.getListaByIdOrFail(dato.id);
    if (dato.fecha && dato.proveedor) return await this.createLista(
      { 
        fecha: dato.fecha,
        proveedor: dato.proveedor
      }, 
      qr
    ); 
    throw new BadRequestException('Faltan datos para obtener o crear la lista');
  }

  async updateLista(id: string, dato: ListaDtoEditar): Promise<Lista> {
    try {
      const lista: Lista = await this.getListaByIdOrFail(id);

      const proveedor: Proveedor = dato && dato.proveedor
        ? await this.proveedorService.getProveedorByIdOrFail(dato.proveedor)
        : lista.proveedor;

      const listaProducto: ListaProducto[] = dato.listaProductos && dato.listaProductos.length > 0
        ? await this.listaProductoService.updateListaProductos(dato.listaProductos)
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

  async deleteLista(id: string): Promise<boolean> {
    try {
      const lista: Lista = await this.getListaByIdOrFail(id);

      await this.listaRepository.remove(lista)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato la lista`)
    }
  }

}
