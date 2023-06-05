import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportesModule } from './reportes/reportes.module';
import { ObservacionesModule } from './observaciones/observaciones.module';
import { HotelesModule } from './hoteles/hoteles.module';
import { UploadFileS3Service } from './services/upload-file-s3/upload-file-s3.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
      type: 'mysql',
      host:'localhost',
      port:3306,
      username:'root',
      password:'',
      database:'reportesapi',
      entities:[__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true
    }),
    UsersModule,
    ReportesModule,
    ObservacionesModule,
    HotelesModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadFileS3Service],
})
export class AppModule {}
