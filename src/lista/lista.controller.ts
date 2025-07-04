import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ListaService } from './lista.service';
import { Lista } from './entity/lista.entity';
import { ListaDtoCrear } from './dto/listaCrear.dto';
import { ListaDtoEditar } from './dto/listaEditar.dto';

@Controller('lista')
export class ListaController { 
  constructor(private readonly listaService: ListaService) { }

  @Get()
  @HttpCode(200)
  async getLista(): Promise<Lista[]> {
    return await this.listaService.getLista();
  }

  @Get(':id')
  @HttpCode(200)
  async getListaById(
    @Param('id') id: string
  ): Promise<Lista> {
    const cbu: Lista = await this.listaService.getListaByIdOrFail(id);
    return cbu;
  }

  @Post()
  async createLista(
    @Body() datos: ListaDtoCrear
  ): Promise<Lista> {
    return await this.listaService.createLista(datos);
  }

  @Put(':id')
  async updateLista(
    @Param('id') id: string, 
    @Body() datos: ListaDtoEditar
  ): Promise<Lista> {
    return await this.listaService.updateLista(id, datos);
  }

  @Delete(':id')
  async deleteLista(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.listaService.deleteLista(id);
  }
}