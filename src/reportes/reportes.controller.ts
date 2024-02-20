/* eslint-disable @typescript-eslint/no-empty-function */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Render, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { crearReporteDto } from './dto/crear-reporte.dto';
import { editarReporteDto } from './dto/editar-reporte.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { crearFirmaDto } from './dto/crear-firmas.dto';
import * as moment from "moment";
import { AuthGuard } from 'src/auth/auth.guard';
import { crearFirmaObsDto } from './dto/crear-firmas-obs.dto';
// @UseGuards(AuthGuard)
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

    @Get(':id/alto')
    listarUsuarioAlto(@Param('id', ParseIntPipe) id: number) {
        return this._reportes.listarReportePorIdTodaLaInfoAlto(id);
    }


    @Post()
    createReporte(@Body() newReporte: crearReporteDto) {
        return this._reportes.crearReporte(newReporte);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this._reportes.desactivarReporte(id);
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

    @Post('obs/firma')
    @UseInterceptors(FileInterceptor('file'))
    crearFirmaDeObs(@UploadedFile() file, @Body() newFirma: crearFirmaObsDto) {
        return this._reportes.crearFirmaObs(newFirma, file)
    }


    @Post('firmaEliminar')
    eliminarFirmaDeReporte(@Body() firma: any) {
        return this._reportes.eliminarFirma(firma.idFirmaReporte, firma.path)
    }


    @Get('pdf/view/:id')
    @Render('pdf.hbs')
    async root(@Param('id', ParseIntPipe) id: number) {
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        const informacion = data[0]
        return informacion;
    }

    @Get('pdf/view/:id/Baja')
    @Render('pdfBaja.hbs')
    async root2(@Param('id', ParseIntPipe) id: number) {
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        const informacion = data[0]
        return informacion;
    }

    @Get('pdf/view/:id/Mantenimiento')
    @Render('pdfMantenimiento.hbs')
    async root3(@Param('id', ParseIntPipe) id: number) {
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        const informacion = data[0]
        console.log(informacion);
        
        return informacion;
    }

    @Get(':id/pdfReporte')
    async generatePDFOFI(@Res() res, @Param('id', ParseIntPipe) id: number) {
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        const buffer = await this._reportes.generatepdfHtml(data[0]);
        const d = new Date();
        const fileName = 'reporte-'+data[0].idReporte+'-' + data[0].hoteles[0]['nombre']+'-'+moment(d).format('YYYY-MM-DD');
        res.set({
            // pdf
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${fileName}-.pdf`,
            'Content-Length': buffer.length,
            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });

        res.end(buffer);
    }

    @Get(':id/pdfReporte/:tipo')
    async generatePDFOFI2(@Res() res, @Param('id', ParseIntPipe) id: number, @Param('tipo') tipo: string) {
        console.log('tipo',tipo);
        
        const data = await this._reportes.listarReportePorIdTodaLaInfo(id);
        const buffer = await this._reportes.generatepdfHtml2(data[0],tipo);
        const d = new Date();
        const fileName = 'reporte-'+data[0].idReporte+'-' + data[0].hoteles[0]['nombre']+'-'+moment(d).format('YYYY-MM-DD');
        res.set({
            // pdf
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${fileName}-.pdf`,
            'Content-Length': buffer.length,
            // prevent cache
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: 0,
        });

        res.end(buffer);
    }


    @Post('/filter')
    getFilters(@Body() filters) {   
        return this._reportes.listarReportesFiltros(filters);
    }

    @Post('/filter2')
    getFilters2(@Body() filters) {   
        return this._reportes.listarReportesFiltros2(filters);
    }

    @Post('/filtermobile')
    getFiltersMobile(@Body() filters) {   
        return this._reportes.listarReportesFiltrosMobile(filters);
    }

    
    @Post('/filterExcel')
    getFilterExcel(@Body() filters) {   
        return this._reportes.listarReportesFiltroExcel(filters);
    }

    @Post('/comprespdf')
    @UseInterceptors(AnyFilesInterceptor())
    compresspdf(
      @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
      return this._reportes.compresspdfv2(files)
    }

}
