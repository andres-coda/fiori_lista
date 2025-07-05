import { forwardRef, Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entity/producto.entity';
import { Rubro } from 'src/rubro/entity/rubro.entity';
import { ListaProducto } from 'src/lista-producto/entity/listaProducto.entity';
import { Proveedor } from 'src/proveedor/entity/proveedor.entity';
import { ErroresModule } from 'src/errores/errores.module';

@Module({
  imports: [TypeOrmModule.forFeature([
      Producto,
      Rubro,
      ListaProducto,
      Proveedor,
    ]),
    forwardRef(() => ErroresModule),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService]
})
export class ProductoModule {}
