import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { User } from 'src/users/entitiys/user.entity';
import { UsersService } from 'src/users/users.service';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private _user:UsersService){

    }

    @Get()
    listarUsuarios(): Promise<User[]>{
        return this._user.listarUsuario();
    }

    @Get(':id')
    listarUsuario(@Param('id',ParseIntPipe) id:number){   
        return this._user.listarUsuarioPorID(id);
    }
    
    @Post()
    createUser(@Body() newUser: createUserDto){
        return this._user.createUser(newUser);
    }

    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id:number){
        return this._user.eliminarUsuario(id);
    }

    @Patch(':id')
    editarUsuario(@Param('id',ParseIntPipe) id:number, @Body()user: updateUserDto){
        return this._user.updateUsusario(id,user);
    }


}
