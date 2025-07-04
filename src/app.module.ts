import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { RubroModule } from './rubro/rubro.module';
import { ListaModule } from './lista/lista.module';
import { ListaProductoModule } from './lista-producto/lista-producto.module';
import { Lista } from './lista/entity/lista.entity';
import { ListaProducto } from './lista-producto/entity/listaProducto.entity';
import { Producto } from './producto/entity/producto.entity';
import { Proveedor } from './proveedor/entity/proveedor.entity';
import { Rubro } from './rubro/entity/rubro.entity';
import { ErroresModule } from './errores/errores.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'lista_fiori',
      ssl: false,
      entities: [
        Lista,
        ListaProducto,
        Producto,
        Proveedor,
        Rubro
      ],
      synchronize: false,
      logging: false,
    }),
    ProductoModule,
    ProveedorModule,
    RubroModule,
    ListaModule,
    ListaProductoModule,
    ErroresModule,
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
