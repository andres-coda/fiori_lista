import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ListaService } from './lista.service';
import { Lista } from './entity/lista.entity';
import { ListaDtoCrear } from './dto/listaCrear.dto';
import { ListaDtoEditar } from './dto/listaEditar.dto';
import { UsuarioActual } from 'src/utils/decoradores/usuarioActual.decorador';
import { User } from 'src/user/entity/user.entity';

@Controller('lista')
export class ListaController {
  constructor(private readonly listaService: ListaService) { }

  @Get()
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getLista(
    @UsuarioActual() user: User,
  ): Promise<Lista[]> {
    return await this.listaService.getLista(user.id);
  }

  @Get(':id')
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getListaById(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Lista> {
    const cbu: Lista = await this.listaService.getListaByIdOrFail(id, user.id);
    return cbu;
  }

  @Get('/fecha:fecha')
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getListaByFecha(
    @UsuarioActual() user: User,
    @Param('fecha') fecha: Date
  ): Promise<Lista | null> {
    const lista: Lista | null = await this.listaService.getListaByFecha(fecha, user.id);
    return lista;
  }

  @Post()
  @UseGuards(UseGuards)
  async createLista(
    @UsuarioActual() user: User,
    @Body() datos: ListaDtoCrear
  ): Promise<Lista> {
    return await this.listaService.createLista(datos, user);
  }

  @Put(':id')
  @UseGuards(UseGuards)
  async updateLista(
    @UsuarioActual() user: User,
    @Param('id') id: string,
    @Body() datos: ListaDtoEditar
  ): Promise<Lista> {
    return await this.listaService.updateLista(id, datos, user.id);
  }

  @Delete(':id')
  @UseGuards(UseGuards)
  async deleteLista(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.listaService.deleteLista(id, user.id);
  }
}