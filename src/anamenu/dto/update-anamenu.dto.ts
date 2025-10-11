import { PartialType } from '@nestjs/swagger';
import { CreateAnamenuDto } from './create-anamenu.dto';

export class UpdateAnamenuDto extends PartialType(CreateAnamenuDto) {}
