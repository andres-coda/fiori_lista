import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';

export const UsuarioActual = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
     if (ctx.getType() !== 'http') throw new NotFoundException('No se encontro contexto para la peticion http');
    const request = ctx.switchToHttp().getRequest();
    const usuario: User = request.user;
    return usuario;
  },
);

