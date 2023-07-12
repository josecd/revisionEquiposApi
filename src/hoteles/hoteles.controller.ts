   // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { HotelesService } from './hoteles.service';
import { Hoteles } from './entitys/hotel.entity';
import { crearHotelDto } from './dto/crear-hotel.dto';
import { editarHotelDto } from './dto/editar-hotel.dto';
import { crearTrabajadorDto } from './dto/crear-trabajador.dto';
import { editarEstadoHotelDto } from './dto/cambiar-estado.dto';
import { editarTrabajadorDto } from './dto/editar-trabajador.dto';

@Controller('hoteles')
export class HotelesController {

    constructor(private _hotel:HotelesService){

    }

    @Get()
    listarHoteles(): Promise<Hoteles[]>{
        return this._hotel.listarHoteles();
    }

    
    @Get(':id')
    listarUsuario(@Param('id',ParseIntPipe) id:number){   
        return this._hotel.listarHotelPorID(id);
    }

    @Post()
    createHotel(@Body() newHotal: crearHotelDto){
        return this._hotel.crearHotel(newHotal);
    }
 
    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id:number){
        return this._hotel.eliminarHotel(id);
    }

    @Patch(':id')
    editarHotel(@Param('id',ParseIntPipe) id:number, @Body()user: editarHotelDto){
        return this._hotel.editarHotel(id,user);
    }

    @Patch(':id/cambiarEstadoHotel')
    cambiarEstadoHotel(@Param('id',ParseIntPipe) id:number, @Body()estado: editarEstadoHotelDto){   
        return this._hotel.cambiarEstadoHotel(id,estado);
    }

    //Trabajador
    @Post('/trabajador')
    createTrabador(@Body() newTrabajador: crearTrabajadorDto){
        return this._hotel.crearTrabajador(newTrabajador);
    }

    @Get(':id/trabajador')
    listarTrabajadorPorID(@Param('id',ParseIntPipe) id:number){   
        return this._hotel.listarHotelPorID(id);
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    @Patch(':id/trabajador')
    editarTrabajador(@Param('id',ParseIntPipe) id:number, @Body()trabajador: editarTrabajadorDto){
        return this._hotel.editarTrabajador(id,trabajador);
    }
    
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    @Delete(':id/trabajador')
    deleteTrabajador(@Param('id',ParseIntPipe) id:number){
        return this._hotel.eliminarTrabajador(id);
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    @Patch(':id/cambiarEstadoTrabajador')
    cambiarEstadoTrabajador(@Param('id',ParseIntPipe) id:number, @Body()estado: editarEstadoHotelDto){   
        return this._hotel.cambiarEstadoTrabajador(id,estado);
    }


}
