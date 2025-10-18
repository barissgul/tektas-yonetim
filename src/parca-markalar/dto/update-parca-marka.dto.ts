import { PartialType } from '@nestjs/swagger';
import { CreateParcaMarkaDto } from './create-parca-marka.dto';

export class UpdateParcaMarkaDto extends PartialType(CreateParcaMarkaDto) {}

