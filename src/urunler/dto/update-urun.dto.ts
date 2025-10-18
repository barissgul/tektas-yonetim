import { PartialType } from '@nestjs/swagger';
import { CreateUrunDto } from './create-urun.dto';

export class UpdateUrunDto extends PartialType(CreateUrunDto) {}

