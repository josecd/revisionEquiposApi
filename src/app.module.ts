import { Module, ParseIntPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReportesModule } from './reportes/reportes.module';
import { ObservacionesModule } from './observaciones/observaciones.module';
import { HotelesModule } from './hoteles/hoteles.module';
import { UploadFileS3Service } from './services/upload-file-s3/upload-file-s3.service';
import * as  process from "process";

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
      type: 'mysql',
      host:process.env.HOST,
      port:  parseInt(process.env.PORT),
      username:process.env.USERNAME,
      password:process.env.PASSWORD,
      database:'apirevision',
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
