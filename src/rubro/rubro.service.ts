import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Rubro } from './entity/rubro.entity';
import { RubroDtoCrear } from './dto/rubroCrear.dto';
import { RubroDtoEditar } from './dto/rubroEditar.dto';
import { ProductoService } from 'src/producto/producto.service';
import { Producto } from 'src/producto/entity/producto.entity';
import { ProductoDtoEditar } from 'src/producto/dto/productoEditar.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class RubroService {
  constructor(
    @InjectRepository(Rubro) private readonly rubroRepository: Repository<Rubro>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
    private readonly productoService: ProductoService
  ) { }

  async getRubro(userId:string): Promise<Rubro[]> {
    try {
      const criterio: FindManyOptions = {
        where: {
          user:{
            id:userId
          }
        },
        order: {
          rubro: 'ASC'
        }
      }

      const rubro: Rubro[] = await this.rubroRepository.find(criterio);

      return rubro;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroById(id: string, userId:string): Promise<Rubro | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          user:{
            id:userId
          },
          id: id
        }
      }

      const rubro: Rubro | null = await this.rubroRepository.findOne(criterio);
      return rubro;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroByName(dato: string, userId:string): Promise<Rubro | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          user:{
            id:userId
          },
          rubro: dato
        }
      }

      const rubro: Rubro | null = await this.rubroRepository.findOne(criterio);
      return rubro;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroByIdOrFail(id: string, userId:string): Promise<Rubro> {
    try {
      const rubro: Rubro | null = await this.getRubroById(id, userId);
      if (!rubro) throw new NotFoundException(`No existe rubro con el id ${id}`)
      return rubro;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async createRubro(dato: RubroDtoCrear, user:User): Promise<Rubro> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      let rubro: Rubro | null = await this.getRubroByName(dato.rubro, user.id);
      if (rubro) return rubro;

      const productos: Producto[] = dato && dato.productos
        ? await this.productoService.getOrCreateProductos(dato.productos, qr)
        : [];

      rubro = new Rubro()

      rubro.rubro = dato.rubro;
      rubro.producto = productos;
      rubro.user = user;

      const newRubro: Rubro = await qr.manager.save(Rubro, rubro)

      await qr.commitTransaction();

      return newRubro;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de rubro`)
    } finally {
      await qr.release();
    }
  }

  async updateRubro(id: string, dato: RubroDtoEditar, userId:string): Promise<Rubro> {
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const rubro: Rubro = await this.getRubroByIdOrFail(id, userId);

      const productos: Producto[] = dato && dato.productos
        ? await this.productoService.getOrCreateProductos(dato.productos, qr)
        : rubro.producto;

      rubro.rubro = dato.rubro || rubro.rubro;
      rubro.producto = productos;

      const newRubro: Rubro = await qr.manager.save(Rubro, rubro);
      await qr.commitTransaction();
      return newRubro;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de rubro`)
    } finally {
      await qr.release();
    }
  }

  async addProductoRubro(id: string, datos: ProductoDtoEditar[], userId:string):Promise<Rubro>{
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const rubro: Rubro = await this.getRubroByIdOrFail(id, userId);

      const productos: Producto[] = await this.productoService.getOrCreateProductos(datos, qr);
      rubro.producto =this.productoService.addProductosUnicos(rubro.producto, productos);

      const newRubro: Rubro = await qr.manager.save(Rubro, rubro);
      await qr.commitTransaction();
      return newRubro;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de rubro`)
    } finally {
      await qr.release();
    }
  }

  async substractProductoRubro(id: string, datos: ProductoDtoEditar[], userId:string):Promise<Rubro>{
    const qr: QueryRunner = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const rubro: Rubro = await this.getRubroByIdOrFail(id, userId);

      const productos: Producto[] = await this.productoService.getOrCreateProductos(datos, qr);

      rubro.producto = this.productoService.subProductos(rubro.producto, productos);

      const newRubro: Rubro = await qr.manager.save(Rubro, rubro);
      await qr.commitTransaction();
      return newRubro;
    } catch (error) {
      await qr.rollbackTransaction();
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de rubro`)
    } finally {
      await qr.release();
    }
  }

  async deleteRubro(id: string, userId:string): Promise<boolean> {
    try {
      const rubro: Rubro = await this.getRubroByIdOrFail(id, userId);

      await this.rubroRepository.remove(rubro)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de rubro`)
    }
  }

}
