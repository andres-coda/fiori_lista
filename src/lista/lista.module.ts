import { forwardRef, Module } from '@nestjs/common';
import { ListaController } from './lista.controller';
import { ListaService } from './lista.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lista } from './entity/lista.entity';
import { Proveedor } from 'src/proveedor/entity/proveedor.entity';
import { ListaProducto } from 'src/lista-producto/entity/listaProducto.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { ProveedorModule } from 'src/proveedor/proveedor.module';
import { ListaProductoModule } from 'src/lista-producto/lista-producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([
      Lista,
      Proveedor,
      ListaProducto,
    ]),
    forwardRef(() => ErroresModule),
    forwardRef(() => ProveedorModule),
    forwardRef(() => ListaProductoModule),
  ],
  controllers: [ListaController],
  providers: [ListaService],
  exports: [ListaService]
})
export class ListaModule {}
