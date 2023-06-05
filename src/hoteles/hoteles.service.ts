import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hoteles } from './entitys/hotel.entity';
import { Repository } from 'typeorm';
import { crearHotelDto } from './dto/crear-hotel.dto';
import { editarHotelDto } from './dto/editar-hotel.dto';
import { TrabajadoresHotel } from './entitys/trabajador-hotel.entity';
import { crearTrabajadorDto } from './dto/crear-trabajador.dto';
import { UsersService } from 'src/users/users.service';
import { editarEstadoHotelDto } from './dto/cambiar-estado.dto';
import { log } from 'console';
import { editarTrabajadorDto } from './dto/editar-trabajador.dto';

@Injectable()
export class HotelesService {
  constructor(
    @InjectRepository(Hoteles) private hotelRepositorio: Repository<Hoteles>,
    @InjectRepository(TrabajadoresHotel)
    private trabajadorHotelRepositorio: Repository<TrabajadoresHotel>,
    private _user: UsersService,
  ) {}

  listarHoteles() {
    return this.hotelRepositorio.find();
  }

  async listarHotelPorID(id: number) {
    const userFound = await this.hotelRepositorio.findOne({
      where: {
        idHotel: id,
      },
      relations: ['trabajadores'],
    });
    if (!userFound) {
      return new HttpException('Hotel no encontrado', HttpStatus.NOT_FOUND);
    } else {
      return userFound;
    }
  }

  async listarHotelPorIdSinException(id: number) {
    const userFound = await this.hotelRepositorio.findOne({
      where: {
        idHotel: id,
      },
    //   relations: ['trabajadores'],
    });
      return userFound;

  }


  async crearHotel(user: crearHotelDto) {
    const userFound = await this.hotelRepositorio.findOne({
      where: {
        nombre: user.nombre,
      },
    });

    if (userFound) {
      return new HttpException('Hotel ya existe', HttpStatus.CONFLICT);
    }

    const newHotel = this.hotelRepositorio.create(user);
    return this.hotelRepositorio.save(newHotel);
  }



  async eliminarHotel(id: number) {
    const result = await this.hotelRepositorio.delete({ idHotel: id });
    if (result.affected === 0) {
      return new HttpException('Hotel no encontrado', HttpStatus.NOT_FOUND);
    } else {
      return result;
    }
  }

  async editarHotel(id: number, hotel: editarHotelDto) {
    const hotelFound = await this.hotelRepositorio.findOne({
      where: {
        idHotel: id,
      },
    });
    if (!hotelFound) {
      return new HttpException('Hotel no exontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateHotel = Object.assign(hotelFound, hotel);
      return this.hotelRepositorio.save(updateHotel);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async cambiarEstadoHotel(id: number, estado :editarEstadoHotelDto){
    const hotelFound = await this.hotelRepositorio.findOne({
      where: {
        idHotel: id,
      },
    });
    if (!hotelFound) {
      return new HttpException('Hotel no econtrado', HttpStatus.NOT_FOUND);
    } else {
      estado.esActivo = hotelFound.esActivo === '0'?'1':'0';
      const updateHotel = Object.assign(hotelFound,estado );
      return this.hotelRepositorio.save(updateHotel);
    }
  }

  async crearTrabajador(trabajador: crearTrabajadorDto) {
    const userFound = await this._user.listarUsuarioPorIdSinException(trabajador.userlId);
    const hotelFound = await this.listarHotelPorIdSinException(trabajador.hotelId);
    if (!userFound) {
        return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND);
      } 
    if (!hotelFound) {
        return new HttpException('Hotel no exontrado', HttpStatus.NOT_FOUND);
    }
    const newTrabajador = this.trabajadorHotelRepositorio.create(trabajador)
    const saveTrabajador = await this.trabajadorHotelRepositorio.save(newTrabajador)
    newTrabajador.user = userFound;
    newTrabajador.hotel = hotelFound;
    return this.trabajadorHotelRepositorio.save(saveTrabajador)
  }
  
  async editarTrabajador(id: number, trabajador: editarTrabajadorDto) {
    const hotelFound = await this.trabajadorHotelRepositorio.findOne({
      where: {
        idTrabajadoresHotel: id,
      },
    });
    if (!hotelFound) {
      return new HttpException('Trabajador no ecnontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateHotel = Object.assign(hotelFound, trabajador);
      return this.trabajadorHotelRepositorio.save(updateHotel);
    }
  }


  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  async eliminarTrabajador(id: number) {
    const result = await this.trabajadorHotelRepositorio.delete({ idTrabajadoresHotel : id });
    if (result.affected === 0) {
      return new HttpException('Hotel no encontrado', HttpStatus.NOT_FOUND);
    } else {
      return result;
    }
  }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    async cambiarEstadoTrabajador(id: number, estado :editarEstadoHotelDto){
      const trabajadorFound = await this.trabajadorHotelRepositorio.findOne({
        where: {
          idTrabajadoresHotel: id,
        },
      });
      if (!trabajadorFound) {
        return new HttpException('Trabajador no econtrado', HttpStatus.NOT_FOUND);
      } else {
        estado.esActivo = trabajadorFound.esActivo === '0'?'1':'0';
        const updateTrabajador = Object.assign(trabajadorFound,estado );
        return this.trabajadorHotelRepositorio.save(updateTrabajador);
      }
    }
  
}
