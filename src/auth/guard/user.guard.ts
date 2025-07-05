import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Role } from "../rol/rol.enum";

@Injectable()
export class UsuarioGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.authService.getUserFromRequest(request);
    if (user) {
      request.user = Role.User || Role.Admin;
    }
    return true;
  }
}