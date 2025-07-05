import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, In, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Producto } from './entity/producto.entity';
import { ProductoDtoCrear } from './dto/productoCrear.dto';
import { ProductoDtoEditar } from './dto/productoEditar.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
  ) { }

  async getProducto(): Promise<Producto[]> {
    try {
      const criterio: FindManyOptions = {
        order: {
          producto: 'ASC'
        }
      }

      const producto: Producto[] = await this.productoRepository.find(criterio);

      return producto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de producto`)
    }
  }

  async getProductoById(id: string): Promise<Producto | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id
        }
      }

      const producto: Producto | null = await this.productoRepository.findOne(criterio);
      return producto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de producto`)
    }
  }

  async getProductoByIds(ids: string[]): Promise<Producto[]> {
    try {
      const criterio: FindManyOptions = {
        where: {
          ids: In(ids)
        }
      }

      const producto: Producto[] = await this.productoRepository.find(criterio);
      return producto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de producto`)
    }
  }

  async getProductoByName(dato: string): Promise<Producto | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          producto: dato
        }
      }

      const producto: Producto | null = await this.productoRepository.findOne(criterio);
      return producto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de producto`)
    }
  }

  async getProductoByIdOrFail(id: string): Promise<Producto> {
    try {
      const producto: Producto | null = await this.getProductoById(id);
      if (!producto) throw new NotFoundException(`No existe producto con el id ${id}`)
      return producto;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de producto`)
    }
  }

  async createProducto(dato: ProductoDtoCrear, qr?: QueryRunner): Promise<Producto> {
    try {
      let producto: Producto | null = await this.getProductoByName(dato.producto);
      if (producto) return producto;

      producto = new Producto()
      producto.producto = dato.producto;

      const newProducto: Producto = await this.productoRepository.save(producto)

      return newProducto;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de producto`)
    }
  }

  async getOrCreateProducto(dato: ProductoDtoEditar, qr: QueryRunner): Promise<Producto> {
    if (!dato) throw new NotFoundException('No tiene datos para crear o buscar el producto');
    if (dato.id) return await this.getProductoByIdOrFail(dato.id);
    if (dato.producto) return await this.createProducto({ producto: dato.producto }, qr);
    throw new BadRequestException('Faltan datos para obtener o crear el producto');
  }

  addProductosUnicos(productosExistentes: Producto[], productosNuevos: Producto[]): Producto[] {
    const productosExistentesIds = new Set(productosExistentes.map(p => p.id));
    const productosUnicos: Producto[] = productosNuevos.filter(p => !productosExistentesIds.has(p.id));
    return [...productosExistentes, ...productosUnicos]
  }

  subProductos(productosExistentes: Producto[], productosQuitar: Producto[]): Producto[] {
    const productosQuitarIds = new Set(productosQuitar.map(p => p.id));

    const productosFiltrados = productosExistentes.filter(p => !productosQuitarIds.has(p.id));
    return productosFiltrados;
  }

  async getOrCreateProductos(dato: ProductoDtoEditar[], qr: QueryRunner): Promise<Producto[]> {
    if (dato.length == 0) return [];
    const proveedores: Producto[] = await Promise.all(
      dato.map((d) => this.getOrCreateProducto(d, qr))
    );
    return proveedores;
  }

  async updateProducto(id: string, dato: ProductoDtoEditar): Promise<Producto> {
    try {
      const producto: Producto = await this.getProductoByIdOrFail(id);
      producto.producto = dato.producto || producto.producto;

      const newProducto: Producto = await this.productoRepository.save(producto)

      return newProducto;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de producto`)
    }
  }

  async deleteProducto(id: string): Promise<boolean> {
    try {
      const producto: Producto = await this.getProductoByIdOrFail(id);

      await this.productoRepository.remove(producto)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de producto`)
    }
  }

}
