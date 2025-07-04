Etapa 1 - Api Rest

Instalación de contexto y comienzo del desarrollo.
Lenguaje a utilizar: TypeScript con motor de Node.js 
Entorno de desarrollo Visual studio code
Instalación de Nest.js: 

instalacion Node.js  
node: 'v22.15.1', npm: '10.2.3'

instalar Nest.js
npm i -g @nestjs/cli
	v: 11.0.7

crear proyecto 
nest new {nombre del proyecto sin llaves}
lista_fiori

trabajo con git
git status
git add .
git status
git commit -m "Inicio del proyecto"
git remote add origin URL_DEL_REPOSITORIO
git push origin main


instalación server-static
			npm i --save @nestjs/serve-static

Instalar TypeOrm
npm install --save @nestjs/typeorm typeorm mysql2

Instalar clasvalidator y Pipe 
npm i --save class-validator class-transformer

Instalar manejo de variables de entorno
npm install @nestjs/config

Modularización del proyecto
En app.module.ts agregar:
-en cabecera
	import { ServeStaticModule } from ‘@nestjs/serve-static‘;
	import { join } from ‘path‘;

-seccion imports
[
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
      entities: [...],
      synchronize: false,
      logging: false,
    }),
	],

client es la carpeta donde se encuentra las html
Creación del archivo .env con las claves y accesos de la base de datos.
generar los módulos, controladores, servicios y dtos correspondiente para cada entidad

Entidades =>   Lista
		Producto
		Proveedor
		Rubro
		ListaProducto

Relaciones =>
	OneToMany(
Lista	      => ListaProducto,
Producto   => ListaProducto,
Producto   => Rubro,
Proveedor => Lista,
)
ManyToMany(
Producto      => Proveedor,
)

