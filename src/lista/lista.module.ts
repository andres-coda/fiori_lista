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
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      Lista,
      Proveedor,
      ListaProducto,
      User
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
