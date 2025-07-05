import { forwardRef, Module } from '@nestjs/common';
import { RubroController } from './rubro.controller';
import { RubroService } from './rubro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rubro } from './entity/rubro.entity';
import { ErroresModule } from 'src/errores/errores.module';
import { Producto } from 'src/producto/entity/producto.entity';
import { User } from 'src/user/entity/user.entity';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Rubro,
    Producto,
    User
  ]),
  forwardRef(() => ErroresModule),
  forwardRef(() => ProductoModule),
  ],
  controllers: [RubroController],
  providers: [RubroService],
  exports: [RubroService]
})
export class RubroModule { }
