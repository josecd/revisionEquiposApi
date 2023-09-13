import { PartialType } from '@nestjs/swagger';
import { CreateParteDto } from './create-parte.dto';

export class UpdateParteDto extends PartialType(CreateParteDto) {}
