import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { Rubro } from './entity/rubro.entity';
import { RubroDtoCrear } from './dto/rubroCrear.dto';
import { RubroDtoEditar } from './dto/rubroEditar.dto';

@Injectable()
export class RubroService {
  constructor(
    @InjectRepository(Rubro) private readonly rubroRepository: Repository<Rubro>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
  ){}

  async getRubro(): Promise<Rubro[]>{
    try{
      const criterio: FindManyOptions = {
        order: {
          rubro: 'ASC'
        }
      } 

      const rubro: Rubro[] = await this.rubroRepository.find(criterio);

      return rubro;

    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroById(id:string): Promise<Rubro | null>{
    try{
      const criterio: FindOneOptions = {
        where: {
          id: id
        }
      } 

      const rubro: Rubro | null = await this.rubroRepository.findOne(criterio);
      return rubro;
      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroByName(dato:string): Promise<Rubro | null>{
    try{
      const criterio: FindOneOptions = {
        where: {
          rubro: dato
        }
      } 

      const rubro: Rubro | null = await this.rubroRepository.findOne(criterio);
      return rubro;
      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async getRubroByIdOrFail(id:string): Promise<Rubro>{
    try{
      const rubro: Rubro | null = await this.getRubroById(id);
      if(!rubro) throw new NotFoundException(`No existe rubro con el id ${id}`)
      return rubro;
      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de rubro`)
    }
  }

  async createRubro(dato:RubroDtoCrear, qr?:QueryRunner): Promise<Rubro>{
    try{
      let rubro: Rubro | null = await this.getRubroByName(dato.rubro);
      if(rubro) return rubro;

      rubro = new Rubro()
      rubro.rubro = dato.rubro;

      const newRubro: Rubro = qr
        ? await qr.manager.save(Rubro, rubro)
        : await this.rubroRepository.save(rubro);

      return newRubro;      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de rubro`)
    }
  }

  async getOrCreateRubro(dato:RubroDtoEditar, qr:QueryRunner): Promise<Rubro>{
    if (!dato) throw new NotFoundException('No tiene datos para crear o buscar rubro');
    if(dato.id) return await this.getRubroByIdOrFail(dato.id);
    if(dato.rubro) return await this.createRubro({rubro:dato.rubro}, qr);    
    throw new BadRequestException('Faltan datos para obtener o crear un rubro');
  }

  async updateRubro(id:string, dato:RubroDtoEditar): Promise<Rubro>{
    try{
      const rubro: Rubro = await this.getRubroByIdOrFail(id);      
      rubro.rubro = dato.rubro || rubro.rubro;
      
      const newRubro: Rubro = await this.rubroRepository.save(rubro);
      return newRubro;      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de rubro`)
    }
  }

   async deleteRubro(id:string): Promise<boolean>{
    try{
      const rubro: Rubro = await this.getRubroByIdOrFail(id);   
      
      await this.rubroRepository.remove(rubro)
      return true;      
    } catch (error){
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de rubro`)
    }
  }

}
