import { Module } from '@nestjs/common';
import { ObservacionesController } from './observaciones.controller';
import { ObservacionesService } from './observaciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './entitys/observacion.entity';
import { ObservacionImagen } from './entitys/observacion-imagen.entity';
import { ReportesModule } from 'src/reportes/reportes.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Observacion,ObservacionImagen]),
    ReportesModule
  ],
  controllers: [ObservacionesController],
  providers: [ObservacionesService],

})
export class ObservacionesModule {}
