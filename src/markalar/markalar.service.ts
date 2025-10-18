import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMarkaDto } from './dto/create-marka.dto';
import { UpdateMarkaDto } from './dto/update-marka.dto';
import { Marka } from './entities/marka.entity';

@Injectable()
export class MarkalarService {
  constructor(
    @InjectRepository(Marka)
    private readonly markaRepository: Repository<Marka>,
  ) {}

  async create(createMarkaDto: CreateMarkaDto): Promise<Marka> {
    const marka = this.markaRepository.create(createMarkaDto);
    return await this.markaRepository.save(marka);
  }

  async findAll(search?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereCondition: any = {
      durum: 1,
    };

    if (search) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      whereCondition.marka = Like(`%${search}%`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await this.markaRepository.find({
      where: whereCondition,
      order: {
        marka: 'ASC',
      },
    });

    return {
      data,
      meta: {
        total: data.length,
      },
    };
  }

  async findOne(id: number): Promise<Marka> {
    const marka = await this.markaRepository.findOne({
      where: { id },
    });

    if (!marka) {
      throw new NotFoundException(`Marka #${id} bulunamadı`);
    }

    return marka;
  }

  async update(id: number, updateMarkaDto: UpdateMarkaDto): Promise<Marka> {
    const marka = await this.findOne(id);
    Object.assign(marka, updateMarkaDto);
    return await this.markaRepository.save(marka);
  }

  async remove(id: number): Promise<void> {
    const marka = await this.findOne(id);
    await this.markaRepository.remove(marka);
  }
}
