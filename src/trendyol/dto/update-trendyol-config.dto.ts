import { PartialType } from '@nestjs/swagger';
import { CreateTrendyolConfigDto } from './create-trendyol-config.dto';

export class UpdateTrendyolConfigDto extends PartialType(
  CreateTrendyolConfigDto,
) {}

