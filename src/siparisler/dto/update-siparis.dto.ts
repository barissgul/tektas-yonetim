import { PartialType } from '@nestjs/swagger';
import { CreateSiparisDto } from './create-siparis.dto';

export class UpdateSiparisDto extends PartialType(CreateSiparisDto) {}





