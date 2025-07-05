import { forwardRef, Module } from '@nestjs/common';
import { ListaProductoController } from './lista-producto.controller';
import { ListaProductoService } from './lista-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListaProducto } from './entity/listaProducto.entity';
import { Producto } from 'src/producto/entity/producto.entity';
import { Lista } from 'src/lista/entity/lista.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { ProductoModule } from 'src/producto/producto.module';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      ListaProducto,
      Producto,
      Lista,
      User
    ]),
    forwardRef(() => ErroresModule),
    forwardRef(() => ProductoModule),
  ],
  controllers: [ListaProductoController],
  providers: [ListaProductoService],
  exports: [ListaProductoService]
})
export class ListaProductoModule {}
