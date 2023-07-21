import { configurationen } from './configuration';
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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[configurationen],
    }),

    UsersModule,
    ReportesModule,
    ObservacionesModule,
    HotelesModule,
    TypeOrmModule.forRoot(
      {
      type: 'mysql',
      host: process.env.HOST_BD,
      port:  parseInt(process.env.PORT_BD),
      username:process.env.USERNAME_BD,
      password:process.env.PASSWORD_BD,
      database:'apirevision',
      entities:[__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UploadFileS3Service],
})
export class AppModule {}
