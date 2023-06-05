/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ObservacionesService } from './observaciones.service';
import { crearObservacionDto } from './dto/crear-observacion.dto';
import {
  FilesInterceptor,
  AnyFilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import * as moment from 'moment';
import { crearImgObservacionDto } from './dto/crear-imgobservacion.dto';
import { editarObservacionDto } from './dto/editar-observacion.dto';

@Controller('observaciones')
export class ObservacionesController {
  constructor(
    private _observaciones: ObservacionesService,
    private _up: UploadFileS3Service,
  ) {}

  @Post()
  crearObservacion(@Body() newObservacion: crearObservacionDto) {
    return this._observaciones.crearObservacion(newObservacion);
  }

  @Delete(':id')
  deleteUser(@Param('id',ParseIntPipe) id:number){
      return this._observaciones.eliminarObservacion(id);
  }
  
  @Patch(':id')
  editarUsuario(@Param('id',ParseIntPipe) id:number, @Body()observacion: editarObservacionDto){
      return this._observaciones.editarObservacion(id,observacion);
  }


  @Post('imgObservacion')
  @UseInterceptors(AnyFilesInterceptor())
  agregarImagenObservacion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() imgObs:crearImgObservacionDto,
  ) {
    return this._observaciones.agregarImagenesObservacion(files,imgObs)
  }

  @Post('eliminarImgObservacion')
  createUser(@Body() imgObs){
    console.log(imgObs);
      return this._observaciones.eliminarImgObservacion(imgObs.idObservacionImagen,imgObs.path);
  }
}
