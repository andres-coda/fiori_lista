import { Controller, Get, Request, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AuthParcialDto } from './dto/authParcial.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDto) {
      return await this.authService.signIn(signInDto.email, signInDto.clave);
    }  
  
    @Get('profile')
    async getUserFromRequest(@Request() req: Request & {user:AuthParcialDto}):Promise<AuthParcialDto> {
      return await this.authService.getUserFromRequest(req);
    }  
  }