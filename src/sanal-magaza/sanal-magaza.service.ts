import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSanalMagazaDto } from './dto/create-sanal-magaza.dto';
import { UpdateSanalMagazaDto } from './dto/update-sanal-magaza.dto';
import { SanalMagaza } from './entities/sanal-magaza.entity';

@Injectable()
export class SanalMagazaService {
  constructor(
    @InjectRepository(SanalMagaza)
    private readonly sanalMagazaRepository: Repository<SanalMagaza>,
  ) {}

  async create(
    createSanalMagazaDto: CreateSanalMagazaDto,
  ): Promise<SanalMagaza> {
    const sanalMagaza = this.sanalMagazaRepository.create(createSanalMagazaDto);
    return await this.sanalMagazaRepository.save(sanalMagaza);
  }

  async findAll(): Promise<SanalMagaza[]> {
    return await this.sanalMagazaRepository.find({
      order: {
        magaza_adi: 'ASC',
      },
    });
  }

  async findAllActive(): Promise<SanalMagaza[]> {
    return await this.sanalMagazaRepository.find({
      where: { aktif: true },
      order: {
        magaza_adi: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<SanalMagaza> {
    const sanalMagaza = await this.sanalMagazaRepository.findOne({
      where: { id },
    });

    if (!sanalMagaza) {
      throw new NotFoundException(`Sanal Mağaza #${id} bulunamadı`);
    }

    return sanalMagaza;
  }

  async findByMagazaKodu(magaza_kodu: string): Promise<SanalMagaza> {
    const sanalMagaza = await this.sanalMagazaRepository.findOne({
      where: { magaza_kodu },
    });

    if (!sanalMagaza) {
      throw new NotFoundException(`Mağaza kodu '${magaza_kodu}' bulunamadı`);
    }

    return sanalMagaza;
  }

  async update(
    id: number,
    updateSanalMagazaDto: UpdateSanalMagazaDto,
  ): Promise<SanalMagaza> {
    const sanalMagaza = await this.findOne(id);
    Object.assign(sanalMagaza, updateSanalMagazaDto);
    return await this.sanalMagazaRepository.save(sanalMagaza);
  }

  async remove(id: number): Promise<void> {
    const sanalMagaza = await this.findOne(id);
    await this.sanalMagazaRepository.remove(sanalMagaza);
  }

  async toggleActive(id: number): Promise<SanalMagaza> {
    const sanalMagaza = await this.findOne(id);
    sanalMagaza.aktif = !sanalMagaza.aktif;
    return await this.sanalMagazaRepository.save(sanalMagaza);
  }
}
