import { Module } from '@nestjs/common';
import { HotelesService } from './hoteles.service';
import { HotelesController } from './hoteles.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hoteles } from './entitys/hotel.entity';
import { TrabajadoresHotel } from './entitys/trabajador-hotel.entity';

@Module({
  providers: [HotelesService],
  controllers: [HotelesController],
  imports: [ TypeOrmModule.forFeature([Hoteles,TrabajadoresHotel]) ,
  UsersModule],
  exports:[HotelesService]
})
export class HotelesModule {
}
