import { PartialType } from '@nestjs/swagger';
import { CreateAltAnamenuDto } from './create-alt-anamenu.dto';

export class UpdateAltAnamenuDto extends PartialType(CreateAltAnamenuDto) {}
