import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Proveedor } from './entity/proveedor.entity';
import { ProveedorDtoCrear } from './dto/proveedorCrear.dto';
import { ProveedorDtoEditar } from './dto/proveedorEditar.dto';
import { ProductoDtoEditar } from 'src/producto/dto/productoEditar.dto';
import { Producto } from 'src/producto/entity/producto.entity';
import { ProductoService } from 'src/producto/producto.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor) private readonly proveedorRepository: Repository<Proveedor>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly productoService: ProductoService,
  ) { }

  async getProveedor(userId:string): Promise<Proveedor[]> {
    try {
      const criterio: FindManyOptions = {
        where: {
          user:{
            id:userId
          }
        },
        order: {
          nombre: 'ASC'
        }
      }

      const proveedor: Proveedor[] = await this.proveedorRepository.find(criterio);

      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async getProveedorById(id: string, userId:string): Promise<Proveedor | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id,
          user: {
            id:userId
          }
        }
      }

      const proveedor: Proveedor | null = await this.proveedorRepository.findOne(criterio);
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async getProveedorByName(dato: string, userId:string): Promise<Proveedor | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          nombre: dato,
          user: {
            id:userId
          }
        }
      }

      const proveedor: Proveedor | null = await this.proveedorRepository.findOne(criterio);
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async getProveedorByIdOrFail(id: string, userId:string): Promise<Proveedor> {
    try {
      const proveedor: Proveedor | null = await this.getProveedorById(id, userId);
      if (!proveedor) throw new NotFoundException(`No existe proveedor con el id ${id}`)
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async createProveedor(dato: ProveedorDtoCrear, user:User): Promise<Proveedor> {
    try {
      let proveedor: Proveedor | null = await this.getProveedorByName(dato.nombre, user.id);
      if (proveedor) return proveedor;

      proveedor = new Proveedor()
      proveedor.nombre = dato.nombre;
      proveedor.telefono = dato.telefono;
      proveedor.user= user;

      const newProveedor: Proveedor = await this.proveedorRepository.save(proveedor);
      return newProveedor;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de proveedor`)
    }
  }

  async updateProveedor(id: string, dato: ProveedorDtoEditar, userId:string): Promise<Proveedor> {
    try {
      const proveedor: Proveedor = await this.getProveedorByIdOrFail(id, userId);
      proveedor.nombre = dato.nombre || proveedor.nombre;
      proveedor.telefono = dato.telefono || proveedor.telefono;

      const newProveedor: Proveedor = await this.proveedorRepository.save(proveedor);
      return newProveedor;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de proveedor`)
    }
  }

  async addProductoProveedor(id: string, datos: ProductoDtoEditar[], userId:string):Promise<Proveedor>{
      const qr: QueryRunner = this.dataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      try {
        const proveedor: Proveedor = await this.getProveedorByIdOrFail(id, userId);
  
        const productos: Producto[] = await this.productoService.getOrCreateProductos(datos, qr);
        proveedor.producto =this.productoService.addProductosUnicos(proveedor.producto, productos);
  
        const newProveedor: Proveedor = await qr.manager.save(Proveedor, proveedor);
        await qr.commitTransaction();
        return newProveedor;
      } catch (error) {
        await qr.rollbackTransaction();
        throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de proveedor`)
      } finally {
        await qr.release();
      }
    }
  
    async substractProductoProveedor(id: string, datos: ProductoDtoEditar[], userId:string):Promise<Proveedor>{
      const qr: QueryRunner = this.dataSource.createQueryRunner();
      await qr.connect();
      await qr.startTransaction();
      try {
        const proveedor: Proveedor = await this.getProveedorByIdOrFail(id, userId);
  
        const productos: Producto[] = await this.productoService.getOrCreateProductos(datos, qr);
  
        proveedor.producto = this.productoService.subProductos(proveedor.producto, productos);
  
        const newProveedor: Proveedor = await qr.manager.save(Proveedor, proveedor);
        await qr.commitTransaction();
        return newProveedor;
      } catch (error) {
        await qr.rollbackTransaction();
        throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de proveedor`)
      } finally {
        await qr.release();
      }
    }

  async deleteProveedor(id: string, userId:string): Promise<boolean> {
    try {
      const proveedor: Proveedor = await this.getProveedorByIdOrFail(id, userId);

      await this.proveedorRepository.remove(proveedor)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar los datos de proveedor`)
    }
  }

}
