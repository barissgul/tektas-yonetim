import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnamenuDto } from './dto/create-anamenu.dto';
import { UpdateAnamenuDto } from './dto/update-anamenu.dto';
import { Anamenu } from './entities/anamenu.entity';

@Injectable()
export class AnamenuService {
  constructor(
    @InjectRepository(Anamenu)
    private readonly anamenuRepository: Repository<Anamenu>,
  ) {}

  async create(createAnamenuDto: CreateAnamenuDto): Promise<Anamenu> {
    const anamenu = this.anamenuRepository.create(createAnamenuDto);
    return await this.anamenuRepository.save(anamenu);
  }

  async findAll(): Promise<Anamenu[]> {
    return await this.anamenuRepository.find({
      relations: ['menuler', 'altAnamenuler', 'altAnamenuler.menuler'],
      order: {
        sira: 'ASC',
        menuler: {
          sira: 'ASC',
        },
        altAnamenuler: {
          sira: 'ASC',
          menuler: {
            sira: 'ASC',
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Anamenu> {
    const anamenu = await this.anamenuRepository.findOne({
      where: { id },
      relations: ['menuler', 'altAnamenuler', 'altAnamenuler.menuler'],
    });

    if (!anamenu) {
      throw new NotFoundException(`Anamenu #${id} bulunamadı`);
    }

    return anamenu;
  }

  async update(
    id: number,
    updateAnamenuDto: UpdateAnamenuDto,
  ): Promise<Anamenu> {
    const anamenu = await this.findOne(id);
    Object.assign(anamenu, updateAnamenuDto);
    return await this.anamenuRepository.save(anamenu);
  }

  async remove(id: number): Promise<void> {
    const anamenu = await this.findOne(id);
    await this.anamenuRepository.remove(anamenu);
  }
}
