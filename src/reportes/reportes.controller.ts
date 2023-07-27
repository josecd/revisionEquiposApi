/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { crearReporteDto } from './dto/crear-reporte.dto';
import { editarReporteDto } from './dto/editar-reporte.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from "express";
import { crearFirmaDto } from './dto/crear-firmas.dto';
@Controller('reportes')
export class ReportesController {

    constructor(
        private _reportes: ReportesService
    ) {

    }

    @Get()
    listarReportes() {
        return this._reportes.listarReportes();
    }

    @Get(':id')
    listarUsuario(@Param('id', ParseIntPipe) id: number) {
        return this._reportes.listarReportePorIdTodaLaInfo(id);
    }


    @Post()
    createReporte(@Body() newReporte: crearReporteDto) {
        return this._reportes.crearReporte(newReporte);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this._reportes.eliminarReporte(id);
    }

    @Patch(':id')
    editarRp(@Param('id', ParseIntPipe) id: number, @Body() repoorte: editarReporteDto) {
        return this._reportes.editarReporte(id, repoorte)
    }

    @Post('firma')
    @UseInterceptors(FileInterceptor('file'))
    crearFirmaDeReporte(@UploadedFile() file, @Body() newFirma: crearFirmaDto) {
        return this._reportes.crearFirma(newFirma, file)
    }

    @Post('firmaEliminar')
    eliminarFirmaDeReporte(@Body() firma: any) {
        return this._reportes.eliminarFirma(firma.idFirmaReporte, firma.path)
    }

    @Get(':id/pdf2')
    async generatePdf2(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        console.log(data[0]['descripcion']);
        
        const buffer = await this._reportes.secondExample(data[0]);
        res.set({
            // pdf
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=pdf.pdf`,
            'Content-Length': buffer.length,
            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });
        res.end(buffer);
    }



}
