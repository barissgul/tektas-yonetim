import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUrunDto } from './dto/create-urun.dto';
import { UpdateUrunDto } from './dto/update-urun.dto';
import { Urun } from './entities/urun.entity';

@Injectable()
export class UrunlerService {
  constructor(
    @InjectRepository(Urun)
    private readonly urunRepository: Repository<Urun>,
  ) {}

  async create(createUrunDto: CreateUrunDto): Promise<Urun> {
    // Aynı mağazada aynı ürün kodu var mı kontrol et
    const mevcutUrun = await this.urunRepository.findOne({
      where: {
        sanal_magaza_id: createUrunDto.sanal_magaza_id,
        urun_kodu: createUrunDto.urun_kodu,
      },
    });

    if (mevcutUrun) {
      throw new ConflictException(
        'Bu mağazada aynı ürün kodu ile kayıtlı ürün bulunmaktadır',
      );
    }

    const urun = this.urunRepository.create(createUrunDto);
    return await this.urunRepository.save(urun);
  }

  async findAll(): Promise<Urun[]> {
    return await this.urunRepository.find({
      relations: ['sanal_magaza'],
      order: {
        id: 'DESC',
      },
    });
  }

  async findByMagaza(sanalMagazaId: number): Promise<Urun[]> {
    return await this.urunRepository.find({
      where: { sanal_magaza_id: sanalMagazaId },
      relations: ['sanal_magaza'],
      order: {
        urun_adi: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Urun> {
    const urun = await this.urunRepository.findOne({
      where: { id },
      relations: ['sanal_magaza'],
    });

    if (!urun) {
      throw new NotFoundException(`Ürün #${id} bulunamadı`);
    }

    return urun;
  }

  async findByUrunKodu(
    sanalMagazaId: number,
    urunKodu: string,
  ): Promise<Urun> {
    const urun = await this.urunRepository.findOne({
      where: {
        sanal_magaza_id: sanalMagazaId,
        urun_kodu: urunKodu,
      },
      relations: ['sanal_magaza'],
    });

    if (!urun) {
      throw new NotFoundException(
        `Ürün kodu "${urunKodu}" bulunamadı (Mağaza ID: ${sanalMagazaId})`,
      );
    }

    return urun;
  }

  async update(id: number, updateUrunDto: UpdateUrunDto): Promise<Urun> {
    const urun = await this.findOne(id);

    // Ürün kodu değiştiriliyorsa, aynı mağazada aynı kod var mı kontrol et
    if (
      updateUrunDto.urun_kodu &&
      updateUrunDto.urun_kodu !== urun.urun_kodu
    ) {
      const mevcutUrun = await this.urunRepository.findOne({
        where: {
          sanal_magaza_id: urun.sanal_magaza_id,
          urun_kodu: updateUrunDto.urun_kodu,
        },
      });

      if (mevcutUrun) {
        throw new ConflictException(
          'Bu mağazada aynı ürün kodu ile kayıtlı ürün bulunmaktadır',
        );
      }
    }

    Object.assign(urun, updateUrunDto);
    return await this.urunRepository.save(urun);
  }

  async remove(id: number): Promise<void> {
    const urun = await this.findOne(id);
    await this.urunRepository.remove(urun);
  }

  async updateStok(id: number, miktar: number): Promise<Urun> {
    const urun = await this.findOne(id);
    
    const yeniStok = urun.stok_miktari + miktar;
    
    if (yeniStok < 0) {
      throw new BadRequestException(
        'Stok miktarı 0\'dan küçük olamaz. Mevcut stok yetersiz.',
      );
    }

    urun.stok_miktari = yeniStok;
    return await this.urunRepository.save(urun);
  }

  async getDusukStokUrunler(): Promise<Urun[]> {
    // Stok miktarı minimum stok seviyesinin altında olan ürünleri getir
    const urunler = await this.urunRepository
      .createQueryBuilder('urun')
      .leftJoinAndSelect('urun.sanal_magaza', 'sanal_magaza')
      .where('urun.stok_miktari <= urun.min_stok_miktari')
      .andWhere('urun.durum = 1')
      .orderBy('urun.stok_miktari', 'ASC')
      .getMany();

    return urunler;
  }

  async search(searchTerm: string): Promise<Urun[]> {
    return await this.urunRepository
      .createQueryBuilder('urun')
      .leftJoinAndSelect('urun.sanal_magaza', 'sanal_magaza')
      .where('urun.urun_adi LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('urun.urun_kodu LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('urun.barkod LIKE :search', { search: `%${searchTerm}%` })
      .orderBy('urun.urun_adi', 'ASC')
      .getMany();
  }
}

