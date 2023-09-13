/* eslint-disable @typescript-eslint/no-empty-function */

import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parte } from './entities/parte.entity';
import { Repository } from 'typeorm';
import { InventarioService } from '../inventario/inventario.service';
import { CreateParteImgDto } from './dto/create-parte-img.dto';
import { ParteImagen } from './entities/parte-imagen.entity';
import { UsersService } from 'src/users/users.service';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';

@Injectable()
export class ParteService {

  constructor(
    @InjectRepository(Parte)
    private parteRepositorio: Repository<Parte>,
    @InjectRepository(ParteImagen)
    private parteImgRepositorio: Repository<ParteImagen>,

    @Inject(forwardRef(() => InventarioService)) private readonly _inventario: InventarioService,

    private _user: UsersService,
    private _up: UploadFileS3Service,

  ) {

  }


  async create(createParteDto: CreateParteDto) {
    const inventarioFound = await this._inventario.findOneException(createParteDto.inventarioId);
    if (!inventarioFound) {
      return new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    const newParte = this.parteRepositorio.create(createParteDto);
    const saveParte = await this.parteRepositorio.save(newParte);
    newParte.inventario = inventarioFound;
    return this.parteRepositorio.save(saveParte);
  }


  findAll() {
    return this.parteRepositorio.find({
      order: { fechaRegistro: 'DESC' },
      where: {
        esActivo: '1',
      },
      relations: ['partesImagen'],
    })
  }

  async findOne(id: number) {
    const reporteFound = await this.parteRepositorio.findOne({
      where: {
        idParte: id,
        esActivo: '1',
      },
      relations: ['partesImagen'],
    })

    if (!reporteFound) {
      return new HttpException('Dato no encontrado', HttpStatus.NOT_FOUND);
    } else {
      return reporteFound;
    }
  }

  async update(id: number, updateParteDto: UpdateParteDto) {
    const invnetarioFound = await this.parteRepositorio.findOne({
      where: {
        idParte: id,
      },
    });
    if (!invnetarioFound) {
      return new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(invnetarioFound, updateParteDto);
      return this.parteRepositorio.save(updateReporte);
    }
  }

  async remove(id: number) {
    const invnetarioFound = await this.parteRepositorio.findOne({
      where: {
        idParte: id,
      },
    });
    if (!invnetarioFound) {
      return new HttpException('parte no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(invnetarioFound, { esActivo: 0 });
      return this.parteRepositorio.save(updateReporte);
    }
  }

  ///////////////// Imagenes////////////////

  async createImg(files, createParteDto: CreateParteImgDto) {
    const parteFound = await this.parteRepositorio.findOne({
      where: {
        idParte: createParteDto.parteId,
      },
    });

    const userFound = await this._user.listarUsuarioPorIdSinException(
      createParteDto.userId,
    );

    if (!parteFound) {
      return new HttpException('Parte no encontrado', HttpStatus.NOT_FOUND);
    }
    if (!userFound) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }


    await Promise.all(files.map(async (element) => {
      const path = `inventario/${createParteDto.parteId}/parte/` + this._up.returnNameDateType(element['mimetype']);
      const imgBucket = await this._up.upPublicFile(element.buffer, path);
      
      createParteDto.url = imgBucket.Location;
      createParteDto.nombreArchivo = imgBucket.Key;
      createParteDto.tipoArchivo = element.mimetype;
      createParteDto.parteId = parteFound.idParte;
      createParteDto.path = path;
      const newParteImg = this.parteImgRepositorio.create(createParteDto);
      const saveParteImg = await this.parteImgRepositorio.save(newParteImg);
      newParteImg.parte = parteFound;
      newParteImg.user = userFound;
      this.parteImgRepositorio.save(saveParteImg);
    }))
    return await new HttpException('imagenes agregadas', HttpStatus.ACCEPTED);
  }

  async deleteImg(id: number){
    const invnetarioFound = await this.parteImgRepositorio.findOne({
      where: {
        idParteImagen: id,
      },
    });
    if (!invnetarioFound) {
      return new HttpException('img parte no encontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(invnetarioFound, { esActivo: 0 });
      return this.parteImgRepositorio.save(updateReporte);
    }
  }

}
