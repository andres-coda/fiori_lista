import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ErroresService } from 'src/errores/errores.service';
import { User } from './entity/user.entity';
import { UserDtoCrear } from './dto/userDtoCrear.dto';
import { UserDtoEditar } from './dto/userDtoEditar.dto';

@Injectable()
export class UserService { 
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly erroresService: ErroresService,
  ) { }

  async getUser(): Promise<User[]> {
    try {
      const criterio: FindManyOptions = {
        order: {
          user: 'ASC'
        }
      }

      const user: User[] = await this.userRepository.find(criterio);

      return user;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de user`)
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          id: id
        }
      }

      const user: User | null = await this.userRepository.findOne(criterio);
      return user;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de user`)
    }
  }

  async getUserByEmail(dato: string): Promise<User | null> {
    try {
      const criterio: FindOneOptions = {
        where: {
          email: dato
        }
      }

      const user: User | null = await this.userRepository.findOne(criterio);
      return user;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de user`)
    }
  }

  async getUserByIdOrFail(id: string): Promise<User> {
    try {
      const user: User | null = await this.getUserById(id);
      if (!user) throw new NotFoundException(`No existe user con el id ${id}`)
      return user;

    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar leer los datos de user`)
    }
  }

  async createUser(dato: UserDtoCrear): Promise<User> {
    try {
      let user: User | null = await this.getUserByEmail(dato.email);
      if (user) throw new NotFoundException('Email ya existente en la base de datos')

      user = new User()
      user.email = dato.email;
      user.telefono = dato.telefono;
      user.nombre = dato.nombre;
      user.clave = dato.clave;

      const newUser: User = await this.userRepository.save(user);

      return newUser;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar crear un nuevo dato de user`)
    }
  }

  async updateUser(id: string, dato: UserDtoEditar): Promise<User> {
    try {
      const user: User = await this.getUserByIdOrFail(id);
      user.nombre = dato.nombre || user.nombre;
      user.telefono = dato.telefono || user.telefono;
      user.clave = dato.clave || user.clave;

      const newUser: User = await this.userRepository.save(user);
      return newUser;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar actualizar el dato de user`)
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const user: User = await this.getUserByIdOrFail(id);

      await this.userRepository.remove(user)
      return true;
    } catch (error) {
      throw this.erroresService.handleExceptions(error, `Error al intentar borrar el dato de user`)
    }
  }

}
