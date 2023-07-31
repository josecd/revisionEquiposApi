import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitiys/user.entity';
import { Perfil } from './entitiys/perfil.entity';
import { UploadFileS3Service } from 'src/services/upload-file-s3/upload-file-s3.service';
import { OpenaiService } from 'src/services/openai/openai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Perfil]) 
  ],
  providers: [UsersService,UploadFileS3Service,OpenaiService],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
