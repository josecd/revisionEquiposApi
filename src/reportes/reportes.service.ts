/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, JoinColumn, DataSource } from 'typeorm';
import { Reportes } from './entitys/reportes.entity';
import { UsersService } from 'src/users/users.service';
import { HotelesService } from 'src/hoteles/hoteles.service';
import { crearReporteDto } from './dto/crear-reporte.dto';
import { editarReporteDto } from './dto/editar-reporte.dto';
import { crearFirmaDto } from './dto/crear-firmas.dto';
import { FirmasReporte } from './entitys/firmas-reporte.entity';
import { Observacion } from 'src/observaciones/entitys/observacion.entity';
import { ObservacionImagen } from 'src/observaciones/entitys/observacion-imagen.entity';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import * as moment from "moment";
import { ObservacionesService } from 'src/observaciones/observaciones.service';
import { Hoteles } from 'src/hoteles/entitys/hotel.entity';
import { User } from 'src/users/entitiys/user.entity';
import { ObservacionComentario } from 'src/observaciones/entitys/observacion-comentario.entity';

import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
@Injectable()
export class ReportesService {

  constructor(
    @InjectRepository(Reportes)
    private reporteRepositorio: Repository<Reportes>,
    @InjectRepository(FirmasReporte)
    private firmasRepositorio: Repository<FirmasReporte>,

    private _user: UsersService,
    private _hotel: HotelesService,
    private _aws:UploadFileS3Service,

    // @InjectRepository(Observacion)
    // private observacionRepositorio: Repository<Observacion>,
    // @InjectRepository(ObservacionImagen)
    // private observacionImgRepositorio: Repository<ObservacionImagen>,

    private readonly _up: UploadFileS3Service,
    @Inject (forwardRef(()=>ObservacionesService))private readonly _observaciones: ObservacionesService
  ) {}

  listarReportes() {
    return this.reporteRepositorio.find({
      relations:['hoteles','usuario'],
      order: {fechaRegistro: 'DESC'}
    });
  }
  // ASC
  // DESC
  async listarReportePorIdTodaLaInfo(id: number) {
    const reporteFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
      relations:['hoteles','usuario']
    })
    const queyView = await this.reporteRepositorio
    .createQueryBuilder('reportes')
    .where(`reportes.idReporte = ${id}`)
    .leftJoinAndMapMany('reportes.observaciones', Observacion, 'observacion', 'observacion.reporteIdReporte = reportes.idReporte')
    .orderBy('reportes.fechaRegistro', 'DESC')
    .leftJoinAndMapMany('observacion.imagenes', ObservacionImagen, 'imagenes', 'imagenes.observacionIdObservacion = observacion.idObservacion')
    .leftJoinAndMapMany('observacion.comentarios', ObservacionComentario, 'comentarios', 'comentarios.observacionIdObservacion = observacion.idObservacion')
    .leftJoinAndMapMany('reportes.firmas', FirmasReporte, 'firmasReporte', 'firmasReporte.reporteId = reportes.idReporte ')
    .leftJoinAndMapMany('reportes.hoteles', Hoteles, 'hoteles', 'hoteles.idHotel = reportes.hotelId ')
    .leftJoinAndMapMany('reportes.usuario', User, 'usuario', 'usuario.idUsuario = reportes.userId ')
    .getMany();
    
    
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    } else {
      return queyView;
    }
  }

  async listarReportePorIdSinExecption(id: number) {
    const userFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
    });
    return userFound;
  }

  async crearReporte(reporte: crearReporteDto) {
    const userFound = await this._user.listarUsuarioPorIdSinException(
      reporte.userId,
    );
    const hotelFound = await this._hotel.listarHotelPorIdSinException(
      reporte.hotelId,
    );

    if (!userFound) {
      return new HttpException('Usuario no exontrado', HttpStatus.NOT_FOUND);
    }
    if (!hotelFound) {
      return new HttpException('Hotel no exontrado', HttpStatus.NOT_FOUND);
    }

    const newReport = this.reporteRepositorio.create(reporte);
    console.log(newReport);
    
    const saveReporte = await this.reporteRepositorio.save(newReport);
    console.log(saveReporte);
    
    newReport.usuario = userFound;
    newReport.hoteles = hotelFound;

    return this.reporteRepositorio.save(saveReporte);
  }

  async editarReporte(id: number, reporte: editarReporteDto) {
    const reporteFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
    });
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    } else {
      const updateReporte = Object.assign(reporteFound, reporte);
      return this.reporteRepositorio.save(updateReporte);
    }
  }

  async eliminarReporte(id:number) {
    const reporteFound = await this.listarReportePorIdSinExecption(
      id,
    );
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    }else{
      const queyView = await this.reporteRepositorio
      .createQueryBuilder('reportes')
      .where(`reportes.idReporte = ${id}`)
      .leftJoinAndMapMany('reportes.observaciones', Observacion, 'observacion', 'observacion.reporteIdReporte = reportes.idReporte')
      .getMany();
      const queyViewFirmas = await this.reporteRepositorio
      .createQueryBuilder('reportes')
      .where(`reportes.idReporte = ${id}`)
      .leftJoinAndMapMany('reportes.firmasReporte', FirmasReporte, 'firmas', 'firmas.reporteFIdReporte = reportes.idReporte')
      .getMany();
      const firmas= queyViewFirmas[0].firmasReporte
      firmas.forEach(async(element) => {
      this.eliminarFirma(element.idFirmaReporte,element.path) 
      });
      const observaciones = queyView[0].observaciones
      observaciones.forEach(async(element) => {
      this._observaciones.eliminarObservacion(element.idObservacion)
      });
      const result =await this.reporteRepositorio.delete({idReporte:id});
      return new HttpException('Reporte eliminado', HttpStatus.ACCEPTED)
    }
  }

  async crearFirma(firma: crearFirmaDto, file) {
    const reporteFound = await this.listarReportePorIdSinExecption(
      firma.reporteId,
    );
    if (!reporteFound) {
      return new HttpException('Reporte no encontrado', HttpStatus.NOT_FOUND);
    }
    console.log(file);
    
    const path= `${firma.reporteId}/firmas/`+this._up.returnNameDateType(file['mimetype'])
    const fileUP = await this._aws.upPublicFile(file.buffer, path  );
    firma.path = path
    firma.url = fileUP.Location;
    firma.nombreArchivo = fileUP.Key;
    const newFirma = this.firmasRepositorio.create(firma);
    const saveFima = await this.firmasRepositorio.save(newFirma);
    newFirma.reporteF = reporteFound;
    return this.firmasRepositorio.save(saveFima);
  }

  async eliminarFirma(id: number, path: string){
    if (!id) {
      return new HttpException('Id no recibido', HttpStatus.NOT_FOUND);
    }

    const newImgObs = await this.firmasRepositorio.findOne({
      where: {
        idFirmaReporte: id,
      },
    });

    if (!newImgObs) {
      return new HttpException(
        'No hay datos en la base de datos',
        HttpStatus.NOT_FOUND,
      );
    } else {
      const res = await this.firmasRepositorio.delete({
        idFirmaReporte: id,
      });

      if (res.affected === 0) {
        return new HttpException('Firma no encontrada', HttpStatus.NOT_FOUND);
      } else {
        return this._up.deleteBucket(path);
      }
    }
  }

  secondExample(info:any) {
    const data = info;
    const options = {
      format: 'Tabloid',
      displayHeaderFooter: true,
      // margin: {
      //   left: '10mm',
      //   top: '25mm',
      //   right: '10mm',
      //   bottom: '15mm',
      // },
      // landscape: true,
    // headerTemplate: `                    <div style="width: 100%; text-align: center;">
    // <span style="font-size: 20px;">
    //     <div class="col-1">
    //         <img class="me-3"
    //             src="https://d1.awsstatic.com/case-studies/PALACE-RESORTS.e292f526b6499fbee5de1bfd7430fda18e7c913a.png"
    //             alt="" width="48" height="38">

    //     </div>
    //     <div class="col-11" style="text-align: center;">
    //         <div class="lh-1">
    //             <h1 class="h6 mb-0 text-black lh-1">CORPORATIVO MANTENIMIENTO DE COCINAS
    //             </h1>
    //             <small>REVISIÓN DE EQUIPOS</small>
    //         </div>
    //     </div>

    //     </div>`, 
    
    };  
    const filePath = path.join(process.cwd(), './templates/pdf.html');;
    console.log('file',filePath);
    
    return createPdf(filePath, options, data);
  }

}
