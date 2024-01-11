/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entitys/observacion.entity';
import { Repository } from 'typeorm';
import { ReportesService } from 'src/reportes/reportes.service';
import { crearObservacionDto } from './dto/crear-observacion.dto';
import { crearImgObservacionDto } from './dto/crear-imgobservacion.dto';
import * as moment from 'moment';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import { ObservacionImagen } from './entitys/observacion-imagen.entity';
import { editarObservacionDto } from './dto/editar-observacion.dto';
import { ObservacionComentario } from './entitys/observacion-comentario.entity';
import { UsersService } from 'src/users/users.service';
import { crearComentarioObsDto } from './dto/crear-comentario.dto';

import * as path from 'path';
import { HotelesService } from 'src/hoteles/hoteles.service';
@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private observacionRepositorio: Repository<Observacion>,
    @InjectRepository(ObservacionImagen)
    private observacionImgRepositorio: Repository<ObservacionImagen>,

    @InjectRepository(ObservacionComentario)
    private observacionComnetaioRepositorio: Repository<ObservacionComentario>,
    // private _reporte: ReportesService,


    private _up: UploadFileS3Service,
    @Inject(forwardRef(() => ReportesService)) private readonly _reporte: ReportesService,
    private _user: UsersService,

    private _hotel: HotelesService

  ) { }

  async crearObservacion(observacion: crearObservacionDto) {

    const reportFound = await this._reporte.listarReportePorIdSinExecption(
      observacion.reporteId,
    );
    if (!reportFound) {
      return new HttpException('Reporte no encontrado', HttpStatus.NOT_FOUND);
    }
    const hotelFound = await this._hotel.listarHotelPorID(reportFound.hotelId)
    const sumar = hotelFound['contador'] + 1
    observacion.identificador = sumar
    this._hotel.sumaContador(reportFound.hotelId, { contador: sumar })
    observacion.tipoReporte = reportFound.tipoReporte;
    const newObservacion = this.observacionRepositorio.create(observacion);
    const saveObservacion = await this.observacionRepositorio.save(newObservacion);
    newObservacion.reporte = reportFound;
    return this.observacionRepositorio.save(saveObservacion);
  }

  async editarObservacion(id, observacion: editarObservacionDto) {
    const observacionFound = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: id,
      },
    });
    if (!observacionFound) {
      return new HttpException('Observacion no exontrada', HttpStatus.NOT_FOUND);
    } else {
      const updateObservacion = Object.assign(observacionFound, observacion);
      return this.observacionRepositorio.save(updateObservacion);
    }
  }

  async eliminarObservacion(id: number) {
    const observacionFound = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: id,
      },
    })

    if (!observacionFound) {
      return new HttpException('Observacion no encontrada', HttpStatus.NOT_FOUND);
    } else {

      const queyView = await this.observacionImgRepositorio
        .createQueryBuilder('observacion_imagen')
        .where(`observacion_imagen.observacionId = ${id}`)
        .getMany()
      const obsObsoleto = await this.observacionImgRepositorio.remove(queyView)
      obsObsoleto.forEach(async (res) => {
        this._up.deleteBucket(res.path);
      })
      const result = await this.observacionRepositorio.delete({ idObservacion: id });
      return new HttpException('Se elimino', HttpStatus.ACCEPTED)

    }
  }

  async agregarImagenesObservacion(files, imgObs: crearImgObservacionDto) {
    if (!imgObs.observacionId) {
      return new HttpException(
        'Se debe seleccionar la Observacion',
        HttpStatus.NOT_FOUND,
      );
    }
    const observacion = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: imgObs.observacionId,
      },
    });
    if (!observacion) {
      return new HttpException(
        'Observacion no encontrada',
        HttpStatus.NOT_FOUND,
      );
    } else {

      const userFound = await this._user.listarUsuarioPorIdSinException(
        observacion.userId,
      );

      await Promise.all(files.map(async (element) => {
        const path = `reportes/${observacion.reporteId}/observacion/` + this._up.returnNameDateType(element['mimetype']);
        const imgBucket = await this._up.upPublicFile(element.buffer, path);

        imgObs.url = imgBucket.Location;
        imgObs.nombreArchivo = imgBucket.Key;
        imgObs.tipoArchivo = element.mimetype;
        imgObs.observacionId = observacion.idObservacion;
        imgObs.path = path;
        const newImgObs = await this.observacionImgRepositorio.create(imgObs);
        const saveImgObs = await this.observacionImgRepositorio.save(newImgObs);
        newImgObs.observacion = observacion;
        newImgObs.user = userFound;
        this.observacionImgRepositorio.save(saveImgObs);
      }));
      return await new HttpException('imagenes agregadas', HttpStatus.ACCEPTED);
    }
  }

  async eliminarImgObservacion(id: number, path: string) {
    if (!id) {
      return new HttpException('Id no recibido', HttpStatus.NOT_FOUND);
    }

    const newImgObs = await this.observacionImgRepositorio.findOne({
      where: {
        idObservacionImagen: id,
      },
    });

    if (!newImgObs) {
      return new HttpException(
        'No hay datos en la base de datos',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const res = await this.observacionImgRepositorio.delete({
        idObservacionImagen: id,
      });

      if (res.affected === 0) {
        return new HttpException('observacion no encontrada', HttpStatus.NOT_FOUND);
      } else {
        const dato = await this._up.deleteBucket(path);
        if (dato) {
          return new HttpException('imagen borrada', HttpStatus.ACCEPTED);
        }
      }
    }
  }

  async listarObPorIdTodaLaInfo(id: number) {
    const obsFound = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: id,
      },
      relations: ['observacionesImagen', 'observacionesImagen.user', 'observacionesComentario', 'observacionesComentario.user','firmasObs'],
    })


    return obsFound
  }

  async crearComentario(observacion: crearComentarioObsDto) {

    const obsFound = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: observacion.observacionId,
      },
    })

    const userFound = await this._user.listarUsuarioPorIdSinException(
      observacion.userId,
    );

    if (!obsFound) {
      return new HttpException('Observacion no encontrada', HttpStatus.NOT_FOUND);
    }
    const d = new Date();
    observacion.dateString = moment(d).format('YYYY-MM-DD')
    const newObservacion = this.observacionComnetaioRepositorio.create(observacion);
    newObservacion.user = userFound;
    newObservacion.observacion = obsFound;
    const saveObservacion = await this.observacionComnetaioRepositorio.save(newObservacion);
    return this.observacionComnetaioRepositorio.save(saveObservacion);
  }

  firstExample() {
    // const filePath = path.join(process.cwd(), 'templates', './pdf-profile.html');
    // // const filePath = path.join(process.cwd(), 'templates', './index.html');
    // console.log('path',filePath);

    // return createPdf(filePath);
  }



  pdfReporte() {

  }


  async listarObsPorIdSinExecptionFirma(id: number) {
    const observacionFound = await this.observacionRepositorio.findOne({
      where: {
        idObservacion: id,
        esActivo: "1",
      },
    });
    
    const updateObservacion = Object.assign(observacionFound, {fimaConformidad:true});
    await this.observacionRepositorio.save(updateObservacion);
    return observacionFound;
  }


}
