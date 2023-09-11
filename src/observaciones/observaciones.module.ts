import { Module, forwardRef } from '@nestjs/common';
import { ObservacionesController } from './observaciones.controller';
import { ObservacionesService } from './observaciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './entitys/observacion.entity';
import { ObservacionImagen } from './entitys/observacion-imagen.entity';
import { ReportesModule } from 'src/reportes/reportes.module';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import { ObservacionComentario } from './entitys/observacion-comentario.entity';
import { UsersModule } from 'src/users/users.module';
import { HotelesModule } from 'src/hoteles/hoteles.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Observacion,ObservacionImagen,ObservacionComentario]),
    
    forwardRef(() => ReportesModule),
    UsersModule,
    HotelesModule
  ],
  controllers: [ObservacionesController],
  providers: [ObservacionesService,UploadFileS3Service],
  exports:[ObservacionesService,]
})
export class ObservacionesModule {}
