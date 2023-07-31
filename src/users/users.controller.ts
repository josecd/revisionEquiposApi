import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { User } from 'src/users/entitiys/user.entity';
import { UsersService } from 'src/users/users.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { createPerfilDto } from './dto/create-perfil.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenaiService } from 'src/services/openai/openai.service';

@Controller('users')
export class UsersController {

    constructor(private _user: UsersService,
        private _openai: OpenaiService
        ) {

    }

    @Get()
    listarUsuarios(): Promise<User[]> {
        return this._user.listarUsuario();
    }

    @Get(':id')
    listarUsuario(@Param('id', ParseIntPipe) id: number) {
        return this._user.listarUsuarioPorID(id);
    }

    @Post()
    createUser(@Body() newUser: createUserDto) {
        return this._user.createUser(newUser);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this._user.eliminarUsuario(id);
    }

    @Patch(':id')
    editarUsuario(@Param('id', ParseIntPipe) id: number, @Body() user: updateUserDto) {
        return this._user.updateUsusario(id, user);
    }

    @Post(':id/createFirma')
    @UseInterceptors(FileInterceptor('file'))
    createPerfil(
        @UploadedFile() file,
        @Param('id', ParseIntPipe) id: number, @Body() newPerfil: createPerfilDto) {
        return this._user.createFirmaUsuario(id, newPerfil,file);
    }

    @Get('perfil/:id')
    listaUser(@Param('id', ParseIntPipe) id: number) {
        return this._user.listarPerfiloPorID(id);
    }


    @Post('correccion')
    async correcionGramatica(@Body() mensaje) {
        console.log('Mensaje');
        
        const info:any = await this._openai.correccionGramatical(mensaje?.text)
        console.log(info);
        
        return new HttpException(info, HttpStatus.ACCEPTED)
    }

}
