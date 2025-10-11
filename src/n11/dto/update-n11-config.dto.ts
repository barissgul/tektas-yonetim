import { PartialType } from '@nestjs/swagger';
import { CreateN11ConfigDto } from './create-n11-config.dto';

export class UpdateN11ConfigDto extends PartialType(CreateN11ConfigDto) {}

