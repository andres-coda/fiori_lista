import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Rubro } from 'src/rubro/entity/rubro.entity';
import { Proveedor } from 'src/proveedor/entity/proveedor.entity';
import { Lista } from 'src/lista/entity/lista.entity';
import { ListaProducto } from 'src/lista-producto/entity/listaProducto.entity';
import { ErroresModule } from 'src/errores/errores.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Rubro,
    Proveedor,
    Lista,
    ListaProducto
  ]),
  forwardRef(() => ErroresModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
