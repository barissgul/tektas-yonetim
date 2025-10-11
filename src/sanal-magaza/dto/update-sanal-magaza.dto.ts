import { PartialType } from '@nestjs/swagger';
import { CreateSanalMagazaDto } from './create-sanal-magaza.dto';

export class UpdateSanalMagazaDto extends PartialType(CreateSanalMagazaDto) {}

