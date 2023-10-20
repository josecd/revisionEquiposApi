import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Render, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';

import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import * as moment from "moment";
import { AuthGuard } from 'src/auth/auth.guard';
// @UseGuards(AuthGuard)
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  findAll() {
    return this.inventarioService.findAll();
  }

  @Post('/filter')
  findAllFilters(@Body() filters) {   
      return this.inventarioService.findAllFilter(filters);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }

  @Get('pdf/view')
  @Render('pdfinventario.hbs')
  async root() {
      const data = await this.inventarioService.findAll2();
      return data
  }

  @Get('pdf/descargar')
  async generate(@Res() res) {
      const data = await this.inventarioService.findAll2();
      const buffer = await this.inventarioService.generatepdfHtml(data);
      const d = new Date();
      const fileName = moment(d).format('YYYY-MM-DD');
      res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${fileName}-.pdf`,
          'Content-Length': buffer.length,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: 0,
      });
      res.end(buffer);
  }
}
