import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './entity/producto.entity';
import { ProductoDtoCrear } from './dto/productoCrear.dto';
import { ProductoDtoEditar } from './dto/productoEditar.dto';

@Controller('producto')
export class ProductoController { 
  constructor(private readonly productoService: ProductoService) { }

  @Get()
  @HttpCode(200)
  async getProducto(): Promise<Producto[]> {
    return await this.productoService.getProducto();
  }

  @Get(':id')
  @HttpCode(200)
  async getProductoById(
    @Param('id') id: string
  ): Promise<Producto> {
    const cbu: Producto = await this.productoService.getProductoByIdOrFail(id);
    return cbu;
  }

  @Post()
  async createProducto(
    @Body() datos: ProductoDtoCrear
  ): Promise<Producto> {
    return await this.productoService.createProducto(datos);
  }

  @Put(':id')
  async updateProducto(
    @Param('id') id: string,
    @Body() datos: ProductoDtoEditar
  ): Promise<Producto> {
    return await this.productoService.updateProducto(id, datos);
  }

  @Delete(':id')
  async deleteProducto(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.productoService.deleteProducto(id);
  }
}