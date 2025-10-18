import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateParcaMarkaDto } from './dto/create-parca-marka.dto';
import { UpdateParcaMarkaDto } from './dto/update-parca-marka.dto';
import { ParcaMarka } from './entities/parca-marka.entity';

@Injectable()
export class ParcaMarkalarService {
  constructor(
    @InjectRepository(ParcaMarka)
    private readonly parcaMarkaRepository: Repository<ParcaMarka>,
  ) {}

  async create(createParcaMarkaDto: CreateParcaMarkaDto): Promise<ParcaMarka> {
    const parcaMarka = this.parcaMarkaRepository.create(createParcaMarkaDto);
    return await this.parcaMarkaRepository.save(parcaMarka);
  }

  async findAll(search?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereCondition: any = {
      durum: 1,
    };

    if (search) {
      // Birden fazla alanda arama
      const data = await this.parcaMarkaRepository
        .createQueryBuilder('parca_marka')
        .where('parca_marka.durum = :durum', { durum: 1 })
        .andWhere(
          '(parca_marka.parca_marka LIKE :search OR parca_marka.mensei LIKE :search OR parca_marka.parca_turu LIKE :search)',
          { search: `%${search}%` },
        )
        .orderBy('parca_marka.parca_marka', 'ASC')
        .getMany();

      return {
        data,
        meta: {
          total: data.length,
        },
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await this.parcaMarkaRepository.find({
      where: whereCondition,
      order: {
        parca_marka: 'ASC',
      },
    });

    return {
      data,
      meta: {
        total: data.length,
      },
    };
  }

  async findOne(id: number): Promise<ParcaMarka> {
    const parcaMarka = await this.parcaMarkaRepository.findOne({
      where: { id },
    });

    if (!parcaMarka) {
      throw new NotFoundException(`Parça Marka #${id} bulunamadı`);
    }

    return parcaMarka;
  }

  async update(
    id: number,
    updateParcaMarkaDto: UpdateParcaMarkaDto,
  ): Promise<ParcaMarka> {
    const parcaMarka = await this.findOne(id);
    Object.assign(parcaMarka, updateParcaMarkaDto);
    return await this.parcaMarkaRepository.save(parcaMarka);
  }

  async remove(id: number): Promise<void> {
    const parcaMarka = await this.findOne(id);
    await this.parcaMarkaRepository.remove(parcaMarka);
  }
}

