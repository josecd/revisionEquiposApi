/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { crearReporteDto } from './dto/crear-reporte.dto';
import { editarReporteDto } from './dto/editar-reporte.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from "express";
import { crearFirmaDto } from './dto/crear-firmas.dto';
@Controller('reportes')
export class ReportesController {

    constructor(
        private _reportes:ReportesService
    ){
        
    }

    @Get()
    listarReportes(){
        return this._reportes.listarReportes();
    }

    @Get(':id')
    listarUsuario(@Param('id',ParseIntPipe) id:number){   
        return this._reportes.listarReportePorIdTodaLaInfo(id);
    }

    @Post()
    createReporte(@Body() newReporte: crearReporteDto){
        return this._reportes.crearReporte(newReporte);
    }

    @Patch(':id')
    editarRp(@Param('id',ParseIntPipe)id:number,@Body()repoorte:editarReporteDto){
        return this._reportes.editarReporte(id,repoorte)
    }

    @Post('firma')
    @UseInterceptors(FileInterceptor('file'))
    crearFirmaDeReporte(@UploadedFile() file ,@Body() newFirma: crearFirmaDto){
        return this._reportes.crearFirma(newFirma,file)
    }
}
