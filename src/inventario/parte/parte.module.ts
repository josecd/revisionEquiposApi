import { Module, forwardRef } from '@nestjs/common';
import { ParteService } from './parte.service';
import { ParteController } from './parte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Parte } from './entities/parte.entity';
import { ParteImagen } from './entities/parte-imagen.entity';
import { HotelesModule } from 'src/hoteles/hoteles.module';
import { UsersModule } from 'src/users/users.module';
import { InventarioModule } from '../inventario/inventario.module';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Parte,ParteImagen]),
    forwardRef(() => ParteModule),
    ConfigModule.forRoot(),
    InventarioModule,
    UsersModule
  ],
  controllers: [ParteController],
  providers: [ParteService,UploadFileS3Service]
})
export class ParteModule {}
