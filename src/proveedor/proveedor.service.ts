import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Proveedor } from './entity/proveedor.entity';
import { ProveedorDtoCrear } from './dto/proveedorCrear.dto';
import { ProveedorDtoEditar } from './dto/proveedorEditar.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor) private readonly proveedorRepository: Repository<Proveedor>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
  ) { }

  async getProveedor(): Promise<Proveedor[]> {
    try {
      const criterio: FindManyOptions = {
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

  async getProveedorById(id: string): Promise<Proveedor | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id
        }
      }

      const proveedor: Proveedor | null = await this.proveedorRepository.findOne(criterio);
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async getProveedorByName(dato: string): Promise<Proveedor | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          nombre: dato
        }
      }

      const proveedor: Proveedor | null = await this.proveedorRepository.findOne(criterio);
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async getProveedorByIdOrFail(id: string): Promise<Proveedor> {
    try {
      const proveedor: Proveedor | null = await this.getProveedorById(id);
      if (!proveedor) throw new NotFoundException(`No existe proveedor con el id ${id}`)
      return proveedor;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de proveedor`)
    }
  }

  async createProveedor(dato: ProveedorDtoCrear, qr?: QueryRunner): Promise<Proveedor> {
    try {
      let proveedor: Proveedor | null = await this.getProveedorByName(dato.nombre);
      if (proveedor) return proveedor;

      proveedor = new Proveedor()
      proveedor.nombre = dato.nombre;
      proveedor.telefono = dato.telefono;

      const newProveedor: Proveedor = qr
        ? await qr.manager.save(Proveedor, proveedor)
        : await this.proveedorRepository.save(proveedor);

      return newProveedor;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de proveedor`)
    }
  }

  async getOrCreateProveedor(dato: ProveedorDtoEditar, qr: QueryRunner): Promise<Proveedor> {
    if (!dato) throw new NotFoundException('No tiene datos para crear o buscar proveedor');
    if (dato.id) return await this.getProveedorByIdOrFail(dato.id);
    if (dato.nombre && dato.telefono) return await this.createProveedor({ nombre: dato.nombre, telefono: dato.telefono }, qr);
    throw new BadRequestException('Faltan datos para obtener o crear un proveedor');
  }

  async getOrCreateProveedores(dato: ProveedorDtoEditar[], qr:QueryRunner):Promise<Proveedor[]>{
    if(dato.length==0) return [];
      const proveedores: Proveedor[] = await Promise.all(
      dato.map((d) => this.getOrCreateProveedor(d, qr))
    );
    return proveedores;
  }

  async updateProveedor(id: string, dato: ProveedorDtoEditar): Promise<Proveedor> {
    try {
      const proveedor: Proveedor = await this.getProveedorByIdOrFail(id);
      proveedor.nombre = dato.nombre || proveedor.nombre;
      proveedor.telefono = dato.telefono || proveedor.telefono;

      const newProveedor: Proveedor = await this.proveedorRepository.save(proveedor);
      return newProveedor;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de proveedor`)
    }
  }

  async deleteProveedor(id: string): Promise<boolean> {
    try {
      const proveedor: Proveedor = await this.getProveedorByIdOrFail(id);

      await this.proveedorRepository.remove(proveedor)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar los datos de proveedor`)
    }
  }

}
