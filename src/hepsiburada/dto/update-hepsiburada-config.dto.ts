import { PartialType } from '@nestjs/swagger';
import { CreateHepsiburadaConfigDto } from './create-hepsiburada-config.dto';

export class UpdateHepsiburadaConfigDto extends PartialType(
  CreateHepsiburadaConfigDto,
) {}
