import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ParteService } from './parte.service';
import { CreateParteDto } from './dto/create-parte.dto';
import { UpdateParteDto } from './dto/update-parte.dto';
import { CreateParteImgDto } from './dto/create-parte-img.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('parte')
export class ParteController {
  constructor(private readonly parteService: ParteService) {}

  @Post()
  create(@Body() createParteDto: CreateParteDto) {
    return this.parteService.create(createParteDto);
  }


  @Get()
  findAll() {
    return this.parteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParteDto: UpdateParteDto) {
    return this.parteService.update(+id, updateParteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parteService.remove(+id);
  }

  /////// img 

  @Post('imgParte')
  @UseInterceptors(AnyFilesInterceptor())
  agregarImagenObservacion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() createParteDto: CreateParteImgDto,
  ) {
    return this.parteService.createImg(files, createParteDto)
  } 

  @Delete('/img/:id')
  removeImg(@Param('id') id: string) {
    return this.parteService.deleteImg(+id);
  }
}

