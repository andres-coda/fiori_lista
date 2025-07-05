import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserDtoCrear } from './dto/userDtoCrear.dto';
import { UserDtoEditar } from './dto/userDtoEditar.dto';

@Controller('user')
export class UserController { 
  constructor(private readonly userService: UserService) { }

  @Get()
  @HttpCode(200)
  async getUser(): Promise<User[]> {
    return await this.userService.getUser();
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(
    @Param('id') id: string
  ): Promise<User> {
    const cbu: User = await this.userService.getUserByIdOrFail(id);
    return cbu;
  }

  @Post()
  async createUser(
    @Body() datos: UserDtoCrear
  ): Promise<User> {
    return await this.userService.createUser(datos);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() datos: UserDtoEditar
  ): Promise<User> {
    return await this.userService.updateUser(id, datos);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.userService.deleteUser(id);
  }
}