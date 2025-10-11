import { PartialType } from '@nestjs/swagger';
import { CreateYetkilerDto } from './create-yetkiler.dto';

export class UpdateYetkilerDto extends PartialType(CreateYetkilerDto) {}
