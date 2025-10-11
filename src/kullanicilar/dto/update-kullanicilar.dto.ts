import { PartialType } from '@nestjs/swagger';
import { CreateKullanicilarDto } from './create-kullanicilar.dto';

export class UpdateKullanicilarDto extends PartialType(CreateKullanicilarDto) {}
