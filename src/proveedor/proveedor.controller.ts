import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { Proveedor } from './entity/proveedor.entity';
import { ProveedorDtoCrear } from './dto/proveedorCrear.dto';
import { ProveedorDtoEditar } from './dto/proveedorEditar.dto';

@Controller('proveedor')
export class ProveedorController { 
  constructor(private readonly proveedorService: ProveedorService) { }

  @Get()
  @HttpCode(200)
  async getProveedor(): Promise<Proveedor[]> {
    return await this.proveedorService.getProveedor();
  }

  @Get(':id')
  @HttpCode(200)
  async getProveedorById(
    @Param('id') id: string
  ): Promise<Proveedor> {
    const cbu: Proveedor = await this.proveedorService.getProveedorByIdOrFail(id);
    return cbu;
  }

  @Post()
  async createProveedor(
    @Body() datos: ProveedorDtoCrear
  ): Promise<Proveedor> {
    return await this.proveedorService.createProveedor(datos);
  }

  @Put(':id')
  async updateProveedor(
    @Param('id') id: string,
    @Body() datos: ProveedorDtoEditar
  ): Promise<Proveedor> {
    return await this.proveedorService.updateProveedor(id, datos);
  }

  @Delete(':id')
  async deleteProveedor(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.proveedorService.deleteProveedor(id);
  }
}