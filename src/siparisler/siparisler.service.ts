import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateSiparisDto } from './dto/create-siparis.dto';
import { UpdateSiparisDto } from './dto/update-siparis.dto';
import { Siparis } from './entities/siparis.entity';
import { SiparisDetay } from './entities/siparis-detay.entity';

@Injectable()
export class SiparislerService {
  constructor(
    @InjectRepository(Siparis)
    private readonly siparisRepository: Repository<Siparis>,
    @InjectRepository(SiparisDetay)
    private readonly siparisDetayRepository: Repository<SiparisDetay>,
  ) {}

  async create(createSiparisDto: CreateSiparisDto): Promise<Siparis> {
    // Sipariş numarası kontrolü
    const mevcutSiparis = await this.siparisRepository.findOne({
      where: { siparis_no: createSiparisDto.siparis_no },
    });

    if (mevcutSiparis) {
      throw new ConflictException('Bu sipariş numarası zaten kullanılmaktadır');
    }

    // Ara toplam ve toplam tutarı hesapla
    let araToplam = 0;
    const detaylar = createSiparisDto.detaylar.map((detay) => {
      // Her kalem için toplam hesapla
      const kalemToplam = detay.miktar * detay.birim_fiyat - (detay.indirim || 0);
      
      // KDV hesapla
      const kdvTutari = (kalemToplam * (detay.kdv_orani || 0)) / 100;
      
      araToplam += kalemToplam;

      return this.siparisDetayRepository.create({
        ...detay,
        toplam: kalemToplam,
        kdv_tutari: kdvTutari,
      });
    });

    // Toplam tutar = Ara toplam + Kargo - Sipariş indirimi
    const toplamTutar =
      araToplam +
      (createSiparisDto.kargo_ucreti || 0) -
      (createSiparisDto.indirim_tutari || 0);

    // Sipariş oluştur
    const siparis = this.siparisRepository.create({
      ...createSiparisDto,
      ara_toplam: araToplam,
      toplam_tutar: toplamTutar,
      detaylar: detaylar,
    });

    return await this.siparisRepository.save(siparis);
  }

  async findAll(): Promise<Siparis[]> {
    return await this.siparisRepository.find({
      relations: ['sanal_magaza', 'detaylar', 'detaylar.urun'],
      order: {
        siparis_tarihi: 'DESC',
      },
    });
  }

  async findByMagaza(sanalMagazaId: number): Promise<Siparis[]> {
    return await this.siparisRepository.find({
      where: { sanal_magaza_id: sanalMagazaId },
      relations: ['sanal_magaza', 'detaylar', 'detaylar.urun'],
      order: {
        siparis_tarihi: 'DESC',
      },
    });
  }

  async findByDurum(durum: string): Promise<Siparis[]> {
    return await this.siparisRepository.find({
      where: { durum },
      relations: ['sanal_magaza', 'detaylar'],
      order: {
        siparis_tarihi: 'DESC',
      },
    });
  }

  async findByTarihAraligi(
    baslangic: Date,
    bitis: Date,
  ): Promise<Siparis[]> {
    return await this.siparisRepository.find({
      where: {
        siparis_tarihi: Between(baslangic, bitis),
      },
      relations: ['sanal_magaza', 'detaylar'],
      order: {
        siparis_tarihi: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Siparis> {
    const siparis = await this.siparisRepository.findOne({
      where: { id },
      relations: ['sanal_magaza', 'detaylar', 'detaylar.urun'],
    });

    if (!siparis) {
      throw new NotFoundException(`Sipariş #${id} bulunamadı`);
    }

    return siparis;
  }

  async findBySiparisNo(siparisNo: string): Promise<Siparis> {
    const siparis = await this.siparisRepository.findOne({
      where: { siparis_no: siparisNo },
      relations: ['sanal_magaza', 'detaylar', 'detaylar.urun'],
    });

    if (!siparis) {
      throw new NotFoundException(`Sipariş "${siparisNo}" bulunamadı`);
    }

    return siparis;
  }

  async update(id: number, updateSiparisDto: UpdateSiparisDto): Promise<Siparis> {
    const siparis = await this.findOne(id);

    // Detaylar güncelleniyorsa, önce mevcut detayları sil
    if (updateSiparisDto.detaylar) {
      await this.siparisDetayRepository.delete({ siparis_id: id });

      // Yeni detayları oluştur ve ara toplamı hesapla
      let araToplam = 0;
      const detaylar = updateSiparisDto.detaylar.map((detay) => {
        const kalemToplam = detay.miktar * detay.birim_fiyat - (detay.indirim || 0);
        const kdvTutari = (kalemToplam * (detay.kdv_orani || 0)) / 100;
        araToplam += kalemToplam;

        return this.siparisDetayRepository.create({
          ...detay,
          siparis_id: id,
          toplam: kalemToplam,
          kdv_tutari: kdvTutari,
        });
      });

      siparis.detaylar = detaylar;
      siparis.ara_toplam = araToplam;
      siparis.toplam_tutar =
        araToplam +
        (updateSiparisDto.kargo_ucreti ?? siparis.kargo_ucreti) -
        (updateSiparisDto.indirim_tutari ?? siparis.indirim_tutari);
    }

    // Diğer alanları güncelle
    Object.assign(siparis, updateSiparisDto);

    return await this.siparisRepository.save(siparis);
  }

  async updateDurum(id: number, durum: string): Promise<Siparis> {
    const siparis = await this.findOne(id);
    siparis.durum = durum;

    // Duruma göre tarihleri güncelle
    if (durum === 'Onaylandı' && !siparis.onay_tarihi) {
      siparis.onay_tarihi = new Date();
    } else if (durum === 'Kargoya Verildi' && !siparis.kargo_tarihi) {
      siparis.kargo_tarihi = new Date();
    } else if (durum === 'Teslim Edildi' && !siparis.teslim_tarihi) {
      siparis.teslim_tarihi = new Date();
    }

    return await this.siparisRepository.save(siparis);
  }

  async remove(id: number): Promise<void> {
    const siparis = await this.findOne(id);
    await this.siparisRepository.remove(siparis);
  }

  // İstatistikler
  async getIstatistikler(): Promise<any> {
    const tumSiparisler = await this.siparisRepository.find();

    const toplamSiparis = tumSiparisler.length;
    const toplamCiro = tumSiparisler.reduce((sum, s) => sum + Number(s.toplam_tutar), 0);

    const durumlar = tumSiparisler.reduce((acc, s) => {
      acc[s.durum] = (acc[s.durum] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const odemeDurumlari = tumSiparisler.reduce((acc, s) => {
      acc[s.odeme_durumu] = (acc[s.odeme_durumu] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      toplam_siparis: toplamSiparis,
      toplam_ciro: toplamCiro,
      durumlar,
      odeme_durumlari: odemeDurumlari,
    };
  }

  // Bugünün siparişleri
  async getBugunSiparisler(): Promise<Siparis[]> {
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    
    const yarin = new Date(bugun);
    yarin.setDate(yarin.getDate() + 1);

    return await this.siparisRepository.find({
      where: {
        siparis_tarihi: Between(bugun, yarin),
      },
      relations: ['sanal_magaza', 'detaylar'],
      order: {
        siparis_tarihi: 'DESC',
      },
    });
  }
}





