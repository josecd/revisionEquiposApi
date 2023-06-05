import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reportes } from './entitys/reportes.entity';
import { UsersModule } from 'src/users/users.module';
import { HotelesModule } from 'src/hoteles/hoteles.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { FirmasReporte } from './entitys/firmas-reporte.entity';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Reportes,FirmasReporte]),
    UsersModule,
    HotelesModule,
    AwsSdkModule
  ],
  providers: [ReportesService,UploadFileS3Service],
  controllers: [ReportesController],
  exports:[ReportesService]
})
export class ReportesModule {}
