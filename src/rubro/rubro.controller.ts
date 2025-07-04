import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { RubroService } from './rubro.service';
import { Rubro } from './entity/rubro.entity';
import { RubroDtoCrear } from './dto/rubroCrear.dto';
import { RubroDtoEditar } from './dto/rubroEditar.dto';

@Controller('rubro')
export class RubroController { 
  constructor(private readonly rubroService: RubroService) { }

  @Get()
  @HttpCode(200)
  async getRubro(): Promise<Rubro[]> {
    return await this.rubroService.getRubro();
  }

  @Get(':id')
  @HttpCode(200)
  async getRubroById(
    @Param('id') id: string
  ): Promise<Rubro> {
    const cbu: Rubro = await this.rubroService.getRubroByIdOrFail(id);
    return cbu;
  }

  @Post()
  async createRubro(
    @Body() datos: RubroDtoCrear
  ): Promise<Rubro> {
    return await this.rubroService.createRubro(datos);
  }

  @Put(':id')
  async updateRubro(
    @Param('id') id: string, 
    @Body() datos: RubroDtoEditar
  ): Promise<Rubro> {
    return await this.rubroService.updateRubro(id, datos);
  }

  @Delete(':id')
  async deleteRubro(
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.rubroService.deleteRubro(id);
  }
}