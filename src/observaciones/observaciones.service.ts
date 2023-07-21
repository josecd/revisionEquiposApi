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

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private observacionRepositorio: Repository<Observacion>,
    @InjectRepository(ObservacionImagen)
    private observacionImgRepositorio: Repository<ObservacionImagen>,
    // private _reporte: ReportesService,

    
    private _up: UploadFileS3Service,
    @Inject (forwardRef(()=>ReportesService))private readonly _reporte: ReportesService

  ) {}

  async crearObservacion(observacion: crearObservacionDto) {
    const reportFound = await this._reporte.listarReportePorIdSinExecption(
      observacion.reporteId,
    );
    if (!reportFound) {
      return new HttpException('Reporte no encontrado', HttpStatus.NOT_FOUND);
    }
    const newObservacion = this.observacionRepositorio.create(observacion);
    const saveObservacion = await this.observacionRepositorio.save(
      newObservacion,
    );
    newObservacion.reporte = reportFound;
    return this.observacionRepositorio.save(saveObservacion);
  }
  
  async editarObservacion(id,observacion:editarObservacionDto){
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

  async eliminarObservacion(id:number){
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
        obsObsoleto.forEach(async(res)=>{
          this._up.deleteBucket(res.path);
        })
        const result = await this.observacionRepositorio.delete({idObservacion:id});
        return new HttpException('Se elimino',HttpStatus.ACCEPTED)

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
      files.forEach(async (element) => {
        const path =
          `${observacion.reporteId}/observacion/` +
          this._up.returnNameDateType(element['mimetype']);
        const imgBucket = await this._up.upPublicFile(element.buffer, path);
        console.log(imgBucket);
        
        imgObs.url = imgBucket.Location;
        imgObs.nombreArchivo = imgBucket.Key;
        imgObs.tipoArchivo = element.mimetype;
        imgObs.observacionId = observacion.idObservacion;
        imgObs.path = path;
        const newImgObs = await this.observacionImgRepositorio.create(imgObs);
        const saveImgObs = await this.observacionImgRepositorio.save(newImgObs);
        newImgObs.observacion = observacion;
        const save = await this.observacionImgRepositorio.save(saveImgObs);
        console.log('Esto es el save de iamgobs',save);
        
        if (save) {
          return new HttpException('Imagenes agregadas', HttpStatus.ACCEPTED);
        }else{
          return new HttpException('Imagenes no agregadas', HttpStatus.NOT_FOUND);
        }
      });
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
        return this._up.deleteBucket(path);
      }
    }
  }


}
