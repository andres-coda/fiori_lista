import { Controller, Get, Post, Put, HttpCode, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { RubroService } from './rubro.service';
import { Rubro } from './entity/rubro.entity';
import { RubroDtoCrear } from './dto/rubroCrear.dto';
import { RubroDtoEditar } from './dto/rubroEditar.dto';
import { UsuarioActual } from 'src/utils/decoradores/usuarioActual.decorador';
import { User } from 'src/user/entity/user.entity';

@Controller('rubro')
export class RubroController { 
  constructor(private readonly rubroService: RubroService) { }

  @Get()
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getRubro(
    @UsuarioActual() user: User,
  ): Promise<Rubro[]> {
    return await this.rubroService.getRubro(user.id);
  }

  @Get(':id')
  @UseGuards(UseGuards)
  @HttpCode(200)
  async getRubroById(
    @Param('id') id: string,
    @UsuarioActual() user: User,  
  ): Promise<Rubro> {
    const cbu: Rubro = await this.rubroService.getRubroByIdOrFail(id, user.id);
    return cbu;
  }

  @Post()
  @UseGuards(UseGuards)
  async createRubro(
    @UsuarioActual() user: User,
    @Body() datos: RubroDtoCrear
  ): Promise<Rubro> {
    return await this.rubroService.createRubro(datos, user);
  }

  @Put(':id')
  @UseGuards(UseGuards)
  async updateRubro(
    @UsuarioActual() user: User,  
    @Param('id') id: string, 
    @Body() datos: RubroDtoEditar
  ): Promise<Rubro> {
    return await this.rubroService.updateRubro(id, datos, user.id);
  }

  @Delete(':id')
  @UseGuards(UseGuards)
  async deleteRubro(
    @UsuarioActual() user: User,
    @Param('id') id: string
  ): Promise<Boolean> {
    return await this.rubroService.deleteRubro(id, user.id);
  }
}