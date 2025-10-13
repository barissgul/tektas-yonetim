import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAltAnamenuDto } from './dto/create-alt-anamenu.dto';
import { UpdateAltAnamenuDto } from './dto/update-alt-anamenu.dto';
import { AltAnamenu } from './entities/alt-anamenu.entity';

@Injectable()
export class AltAnamenuService {
  constructor(
    @InjectRepository(AltAnamenu)
    private readonly altAnamenuRepository: Repository<AltAnamenu>,
  ) {}

  async create(createAltAnamenuDto: CreateAltAnamenuDto): Promise<AltAnamenu> {
    const altAnamenu = this.altAnamenuRepository.create(createAltAnamenuDto);
    return await this.altAnamenuRepository.save(altAnamenu);
  }

  async findAll(): Promise<AltAnamenu[]> {
    return await this.altAnamenuRepository.find({
      relations: ['anamenu', 'menuler'],
      order: {
        sira: 'ASC',
        menuler: {
          sira: 'ASC',
        },
      },
    });
  }

  async findByAnamenuId(anamenuId: number): Promise<AltAnamenu[]> {
    return await this.altAnamenuRepository.find({
      where: { anamenu_id: anamenuId },
      relations: ['anamenu', 'menuler'],
      order: {
        sira: 'ASC',
        menuler: {
          sira: 'ASC',
        },
      },
    });
  }

  async findOne(id: number): Promise<AltAnamenu> {
    const altAnamenu = await this.altAnamenuRepository.findOne({
      where: { id },
      relations: ['anamenu', 'menuler'],
    });

    if (!altAnamenu) {
      throw new NotFoundException(`Alt Ana Menü #${id} bulunamadı`);
    }

    return altAnamenu;
  }

  async update(
    id: number,
    updateAltAnamenuDto: UpdateAltAnamenuDto,
  ): Promise<AltAnamenu> {
    const altAnamenu = await this.findOne(id);
    Object.assign(altAnamenu, updateAltAnamenuDto);
    return await this.altAnamenuRepository.save(altAnamenu);
  }

  async remove(id: number): Promise<void> {
    const altAnamenu = await this.findOne(id);
    await this.altAnamenuRepository.remove(altAnamenu);
  }
}
