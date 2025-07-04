import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Producto } from './entity/producto.entity';
import { ProductoDtoCrear } from './dto/productoCrear.dto';
import { RubroService } from 'src/rubro/rubro.service';
import { Rubro } from 'src/rubro/entity/rubro.entity';
import { ProductoDtoEditar } from './dto/productoEditar.dto';
import { ProveedorService } from 'src/proveedor/proveedor.service';
import { Proveedor } from 'src/proveedor/entity/proveedor.entity';

@Injectable()
export class ProductoService { 
  constructor(
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly rubroService: RubroService,
    private readonly proveedorService: ProveedorService,
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

  async createProducto(dato: ProductoDtoCrear): Promise<Producto> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      let producto: Producto | null = await this.getProductoByName(dato.producto);
      if (producto) return producto;

      const rubro: Rubro = await this.rubroService.getOrCreateRubro(dato.rubro, qr);

      const proveedor: Proveedor[] = await this.proveedorService.getOrCreateProveedores(dato.proveedor, qr)

      producto = new Producto()
      producto.producto = dato.producto;
      producto.rubro = rubro;
      producto.proveedor = proveedor;

      const newProducto: Producto =  await qr.manager.save(Producto, producto);
      await qr.commitTransaction();

      return newProducto;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de producto`)
    } finally {
      await qr.release();
    }
  }

  async updateProducto(id: string, dato: ProductoDtoEditar): Promise<Producto> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const producto: Producto = await this.getProductoByIdOrFail(id);

      const rubro: Rubro = dato.rubro
        ? await this.rubroService.getOrCreateRubro(dato.rubro, qr)
        : producto.rubro;

      const proveedor: Proveedor[] = dato.proveedor && dato.proveedor.length>0
        ? await this.proveedorService.getOrCreateProveedores(dato.proveedor, qr)
        : producto.proveedor;

      producto.producto = dato.producto || producto.producto;
      producto.rubro = rubro;
      producto.proveedor= proveedor;

      const newProducto: Producto =  await qr.manager.save(Producto, producto);
      await qr.commitTransaction();

      return newProducto;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de producto`)
    } finally {
      await qr.release();
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
