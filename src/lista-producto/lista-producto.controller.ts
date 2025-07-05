import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ListaProductoService } from './lista-producto.service';
import { ListaProducto } from './entity/listaProducto.entity';
import { ListaProductoDtoCrear } from './dto/listaProductoCrear.dto';
import { ListaProductoDtoEditar } from './dto/listaProductoEditar.dto';
import { User } from 'src/user/entity/user.entity';
import { UsuarioActual } from 'src/utils/decoradores/usuarioActual.decorador';
import { ListaProductoDtoEditarArray } from './dto/listaProductoEditarArray.dto';

@Controller('lista-producto')
export class ListaProductoController {
  constructor(private readonly listaProductoService: ListaProductoService) { }

  @Get()
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getListaProducto(
    @UsuarioActual() user: User,
  ): Promise<ListaProducto[]> {
    return await this.listaProductoService.getListaProducto(user.id);
  }

  @Get(':id')
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getListaProductoById(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<ListaProducto> {
    const cbu: ListaProducto = await this.listaProductoService.getListaProductoByIdOrFail(id, user.id);
    return cbu;
  }

  @Post()
  @UseGuards(UseGuards)
  async createListaProducto(
    @UsuarioActual() user: User,
    @Body() datos: ListaProductoDtoCrear
  ): Promise<ListaProducto> {
    return await this.listaProductoService.createListaProducto(datos, user);
  }

  @Put(':id')
  @UseGuards(UseGuards)
  async updateListaProducto(
    @UsuarioActual() user: User,
    @Param('id') id: string,
    @Body() datos: ListaProductoDtoEditarArray
  ): Promise<ListaProducto> {
    return await this.listaProductoService.updateListaProducto(id, datos, user.id);
  }

  @Delete(':id')
  @UseGuards(UseGuards)
  async deleteListaProducto(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.listaProductoService.deleteListaProducto(id, user.id);
  }
}