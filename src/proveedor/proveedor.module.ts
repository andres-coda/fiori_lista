import { forwardRef, Module } from '@nestjs/common';
import { ProveedorController } from './proveedor.controller';
import { ProveedorService } from './proveedor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entity/proveedor.entity';
import { Producto } from 'src/producto/entity/producto.entity';
import { Lista } from 'src/lista/entity/lista.entity';
import { ErroresModule } from 'src/errores/errores.module';

@Module({
  imports: [TypeOrmModule.forFeature([
      Proveedor,
      Producto,
      Lista
    ]),
    forwardRef(() => ErroresModule),
  ],
  controllers: [ProveedorController],
  providers: [ProveedorService],
  exports:[ProveedorService]
})
export class ProveedorModule {}
