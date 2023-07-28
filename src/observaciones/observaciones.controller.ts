import { HttpException, HttpStatus } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
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
  ) { }

  @Post('crear')
  crearObservacion(@Body() newObservacion: crearObservacionDto) {
    return this._observaciones.crearObservacion(newObservacion);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this._observaciones.eliminarObservacion(id);
  }

  @Patch(':id')
  editarUsuario(@Param('id', ParseIntPipe) id: number, @Body() observacion: editarObservacionDto) {
    return this._observaciones.editarObservacion(id, observacion);
  }


  @Post('imgObservacion')
  @UseInterceptors(AnyFilesInterceptor())
  agregarImagenObservacion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() imgObs: crearImgObservacionDto,
  ) {
    console.log('entri');

    return this._observaciones.agregarImagenesObservacion(files, imgObs)
  }

  @Post('eliminarImgObservacion')
  createUser(@Body() imgObs) {
    console.log(imgObs);
    return this._observaciones.eliminarImgObservacion(imgObs.idObservacionImagen, imgObs.path);
  }

  @Get(':id')
  listarObservacion(@Param('id',ParseIntPipe) id:number){   
      return this._observaciones.listarObPorIdTodaLaInfo(id);
  }

  @Post('agregarComentario')
  agregarComentario(@Body() comentario) {
    console.log(comentario);
    return this._observaciones.crearComentario(comentario);
  }

  // @Get('indo')
  // listarReportes() {
  //   console.log('ind');

  //   return new HttpException('Reporte no exontrado', HttpStatus.NOT_FOUND);
  // }

  // @Get('pdf')
  // async generatePdf(@Res() res) {
  //   const buffer = await this._observaciones.firstExample();
  //   console.log(buffer);

  //   res.set({
  //     // pdf
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename=pdf.pdf`,
  //     'Content-Length': buffer.length,
  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });
  //   res.end(buffer);
  // }


}
