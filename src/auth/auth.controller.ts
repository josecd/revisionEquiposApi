import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return new HttpException('Con acceso', HttpStatus.ACCEPTED)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.correo, signInDto.clave);
  }


  // @HttpCode(HttpStatus.OK)
  // @Post('check')
  // check(@Body() signInDto: Record<string, any>) {
  //   return this.authService.signIn(signInDto.correo, signInDto.clave);
  // }



}
