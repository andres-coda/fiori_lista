import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './entity/proveedor.entity';
import { ProveedorDtoCrear } from './dto/proveedorCrear.dto';
import { ProveedorDtoEditar } from './dto/proveedorEditar.dto';
import { UsuarioActual } from 'src/utils/decoradores/usuarioActual.decorador';
import { User } from 'src/user/entity/user.entity';

@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) { }

  @Get()
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getProveedor(
    @UsuarioActual() user: User,
  ): Promise<Proveedor[]> {
    return await this.proveedorService.getProveedor(user.id);
  }

  @Get(':id')
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getProveedorById(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Proveedor> {
    const cbu: Proveedor = await this.proveedorService.getProveedorByIdOrFail(id, user.id);
    return cbu;
  }

  @Post()
  @UseGuards(UseGuards)
  async createProveedor(
    @UsuarioActual() user: User,
    @Body() datos: ProveedorDtoCrear
  ): Promise<Proveedor> {
    return await this.proveedorService.createProveedor(datos, user);
  }

  @Put(':id')
  @UseGuards(UseGuards)
  async updateProveedor(
    @UsuarioActual() user: User,
    @Param('id') id: string,
    @Body() datos: ProveedorDtoEditar
  ): Promise<Proveedor> {
    return await this.proveedorService.updateProveedor(id, datos, user.id);
  }

  @Delete(':id')
  @UseGuards(UseGuards)
  async deleteProveedor(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.proveedorService.deleteProveedor(id, user.id);
  }
}