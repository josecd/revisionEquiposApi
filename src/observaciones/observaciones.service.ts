/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entitys/observacion.entity';
import { Repository } from 'typeorm';
import { ReportesService } from 'src/reportes/reportes.service';
import { crearObservacionDto } from './dto/crear-observacion.dto';

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private observacionRepositorio: Repository<Observacion>,
    private _reporte:ReportesService
  ) {}

  async crearObservacion(observacion:crearObservacionDto) {
    const reportFound = await this._reporte.listarReportePorIdSinExecption(
        observacion.reporteId,
    );
    if (!reportFound) {
      return new HttpException('Reporte no encontrado', HttpStatus.NOT_FOUND);
    }
    const newObservacion = this.observacionRepositorio.create(observacion);

    const saveObservacion= await this.observacionRepositorio.save(newObservacion);
    newObservacion.reporte = reportFound;
    return this.observacionRepositorio.save(saveObservacion);
  }
}
