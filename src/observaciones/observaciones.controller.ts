
import { Body, Controller, Post, UploadedFiles, UseInterceptors ,} from '@nestjs/common';
import { ObservacionesService } from './observaciones.service';
import { crearObservacionDto } from './dto/crear-observacion.dto';
import { FilesInterceptor ,AnyFilesInterceptor} from '@nestjs/platform-express';

@Controller('observaciones')
export class ObservacionesController {
    constructor(
        private _observaciones:ObservacionesService
    ){
    }


    @Post()
    createReporte(@Body() newObservacion:crearObservacionDto){
        return this._observaciones.crearObservacion(newObservacion);
    }

    @Post('arcvhivos')
    @UseInterceptors(AnyFilesInterceptor())
    uploadFile(@UploadedFiles() files: Array<any>) {
      console.log(files);
    }
    
}
