import { forwardRef, Module } from '@nestjs/common';
import { ListaProductoController } from './lista-producto.controller';
import { ListaProductoService } from './lista-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaProducto } from './entity/listaProducto.entity';
import { Producto } from 'src/producto/entity/producto.entity';
import { Lista } from 'src/lista/entity/lista.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { ProductoModule } from 'src/producto/producto.module';
import { ListaModule } from 'src/lista/lista.module';

@Module({
  imports: [TypeOrmModule.forFeature([
      ListaProducto,
      Producto,
      Lista
    ]),
    forwardRef(() => ErroresModule),
    forwardRef(() => ProductoModule),
    forwardRef(() => ListaModule),
  ],
  controllers: [ListaProductoController],
  providers: [ListaProductoService],
  exports: [ListaProductoService]
})
export class ListaProductoModule {}
