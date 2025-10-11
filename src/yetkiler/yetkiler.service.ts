import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateYetkilerDto } from './dto/create-yetkiler.dto';
import { UpdateYetkilerDto } from './dto/update-yetkiler.dto';
import { Yetkiler } from './entities/yetkiler.entity';

@Injectable()
export class YetkilerService {
  constructor(
    @InjectRepository(Yetkiler)
    private readonly yetkilerRepository: Repository<Yetkiler>,
  ) {}

  async create(createYetkilerDto: CreateYetkilerDto): Promise<Yetkiler> {
    const yetki = this.yetkilerRepository.create(createYetkilerDto);
    return await this.yetkilerRepository.save(yetki);
  }

  async findAll(): Promise<Yetkiler[]> {
    return await this.yetkilerRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Yetkiler> {
    const yetki = await this.yetkilerRepository.findOne({
      where: { id },
    });

    if (!yetki) {
      throw new NotFoundException(`Yetki #${id} bulunamadı`);
    }

    return yetki;
  }

  async update(
    id: number,
    updateYetkilerDto: UpdateYetkilerDto,
  ): Promise<Yetkiler> {
    const yetki = await this.findOne(id);
    Object.assign(yetki, updateYetkilerDto);
    return await this.yetkilerRepository.save(yetki);
  }

  async remove(id: number): Promise<void> {
    const yetki = await this.findOne(id);
    await this.yetkilerRepository.remove(yetki);
  }
}
