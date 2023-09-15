/* eslint-disable @typescript-eslint/no-empty-function */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventarios } from './entities/inventario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelesService } from 'src/hoteles/hoteles.service';
import { UsersService } from 'src/users/users.service';
import { log } from 'console';

@Injectable()
export class InventarioService {

  constructor(
    @InjectRepository(Inventarios)
    private invnetarioRepositorio: Repository<Inventarios>,

    private _user: UsersService,
    private _hotel: HotelesService,
  ) {

  }

  async create(createInventarioDto: CreateInventarioDto) {
    const userFound = await this._user.listarUsuarioPorIdSinException(
      createInventarioDto.userId,
    );
    const hotelFound = await this._hotel.listarHotelPorIdSinException(
      createInventarioDto.hotelId,
    );

    if (!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    if (!hotelFound) {
      return new HttpException('Hotel no encontrado', HttpStatus.NOT_FOUND);
    }

    const newInventario = this.invnetarioRepositorio.create(createInventarioDto);

    const saveInventario = await this.invnetarioRepositorio.save(newInventario);

    newInventario.usuario = userFound;
    newInventario.hoteles = hotelFound;

    return this.invnetarioRepositorio.save(saveInventario);

  }

  findAll() {
    return this.invnetarioRepositorio.find({
      relations: ['hoteles', 'usuario','partes','partes.partesImagen'],
      order: { fechaRegistro: 'DESC' },
      where: {
        esActivo: '1',
      },

    })
  }

 async  findAllFilter(filter) {
    let queryData = ''
    if (filter?.hotel) {
      queryData = `MONTH(inventario.fechaRegistro) = ${filter?.mes} AND YEAR(inventario.fechaRegistro) = ${filter?.anio} AND hotelId  IN(${filter?.hotel})`
    } else {
      queryData = `MONTH(inventario.fechaRegistro) = ${filter?.mes} AND YEAR(inventario.fechaRegistro) = ${filter?.anio}`
    }
    const queryView = await this.invnetarioRepositorio
    .createQueryBuilder('inventario')
    .where(queryData)
    .orderBy('inventario.fechaRegistro', 'DESC')
    .andWhere("inventario.esActivo = '1' ")
    .leftJoinAndSelect('inventario.hoteles', 'hoteles')
    .leftJoinAndSelect('inventario.usuario', 'usuario')
    .leftJoinAndSelect('inventario.partes', 'partes')
    .leftJoinAndSelect('partes.partesImagen', 'partesImagen')
    .getMany();
    
    return queryView
    // this.invnetarioRepositorio.find({
    //   relations: ['hoteles', 'usuario','partes','partes.partesImagen'],
    //   order: { fechaRegistro: 'DESC' },
    //   where: {
    //     esActivo: '1',
        
    //   },
    // })

  }


  async findOne(id: number) {
    const reporteFound = await this.invnetarioRepositorio.findOne({
      where: {
        idInventario: id,
        esActivo: '1',
      },
      relations: ['hoteles', 'usuario','partes','partes.partesImagen'],
    })

    if (!reporteFound) {
      return new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    } else {
      return reporteFound;
    }
  }

  async findOneException(id: number) {
    const reporteFound = await this.invnetarioRepositorio.findOne({
      where: {
        idInventario: id,
        esActivo: '1',
      },
      relations: ['hoteles', 'usuario']
    })
    return reporteFound
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto) {
    const invnetarioFound = await this.invnetarioRepositorio.findOne({
      where: {
        idInventario: id,
      },
    });
    if (!invnetarioFound) {
      return new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(invnetarioFound, updateInventarioDto);
      return this.invnetarioRepositorio.save(updateReporte);
    }
  }

  async remove(id: number) {
    const invnetarioFound = await this.invnetarioRepositorio.findOne({
      where: {
        idInventario: id,
      },
    });
    if (!invnetarioFound) {
      return new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(invnetarioFound, {esActivo:0});
      return this.invnetarioRepositorio.save(updateReporte);
    }
  }
}
