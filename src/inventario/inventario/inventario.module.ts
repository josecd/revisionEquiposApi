import { Module, forwardRef } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Inventarios } from './entities/inventario.entity';
import { HotelesModule } from 'src/hoteles/hoteles.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Inventarios]),
    forwardRef(() => InventarioModule),
    ConfigModule.forRoot(),
    UsersModule,
    HotelesModule,
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports:[InventarioService]
})
export class InventarioModule {}
