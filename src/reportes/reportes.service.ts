/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
@Injectable()
export class ReportesService {

  constructor(
    @InjectRepository(Reportes)
    private reporteRepositorio: Repository<Reportes>,
    @InjectRepository(FirmasReporte)
    private firmasRepositorio: Repository<FirmasReporte>,
    @InjectRepository(FirmasReporte)
    private observacionRepositorio: Repository<FirmasReporte>,

    private _user: UsersService,
    private _hotel: HotelesService,
    private dataSource: DataSource,
    private _aws:UploadFileS3Service
  ) {}

  listarReportes() {
    return this.reporteRepositorio.find();
  }

  async listarReportePorIdTodaLaInfo(id: number) {
    const reporteFound = await this.reporteRepositorio.findOne({
      where: {
        idReporte: id,
      },
    //   relations: ['firmasReporte', 'observaciones',],
    })
    const queyView = await this.reporteRepositorio
    .createQueryBuilder('reportes')
    .where(`reportes.idReporte = ${id}`)
    .leftJoinAndMapMany('reportes.observaciones', Observacion, 'observacion', 'observacion.reporteIdReporte = reportes.idReporte')
    .leftJoinAndMapMany('observacion.imagenes', ObservacionImagen, 'imagenes', 'imagenes.observacionIdObservacion = observacion.idObservacion')
    .leftJoinAndMapMany('reportes.firmas', FirmasReporte, 'firmasReporte', 'firmasReporte.reporteId = reportes.idReporte ')
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
      reporte.userlId,
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

    const saveReporte = await this.reporteRepositorio.save(newReport);
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

  eliminar() {}

  async crearFirma(firma: crearFirmaDto, file) {
    const reporteFound = await this.listarReportePorIdSinExecption(
      firma.reporteId,
    );
    if (!reporteFound) {
      return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
    }
    const fileUP = await this._aws.upPublicFile(file.buffer, '1/firmas/'+moment(new Date()).format("YYYY-MM-DD-HH:mm:ss")  );
    console.log(fileUP);
    console.log(firma);
    firma.url = fileUP.Location;
    firma.nombreArchivo = fileUP.Key;
    const newFirma = this.firmasRepositorio.create(firma);
    const saveFima = await this.firmasRepositorio.save(newFirma);
    newFirma.reporteF = reporteFound;
    return this.firmasRepositorio.save(saveFima);
  }


}
