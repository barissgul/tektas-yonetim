import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateKullanicilarDto } from './dto/create-kullanicilar.dto';
import { UpdateKullanicilarDto } from './dto/update-kullanicilar.dto';
import { LoginKullaniciDto } from './dto/login-kullanici.dto';
import { Kullanicilar } from './entities/kullanicilar.entity';

@Injectable()
export class KullanicilarService {
  constructor(
    @InjectRepository(Kullanicilar)
    private readonly kullanicilarRepository: Repository<Kullanicilar>,
  ) {}

  async create(
    createKullanicilarDto: CreateKullanicilarDto,
  ): Promise<Kullanicilar> {
    // Email veya kullanıcı adı kontrolü
    const existingUser = await this.kullanicilarRepository.findOne({
      where: [
        { email: createKullanicilarDto.email },
        { kullanici_adi: createKullanicilarDto.kullanici_adi },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'Bu email veya kullanıcı adı zaten kullanılıyor',
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(createKullanicilarDto.sifre, 10);

    const kullanici = this.kullanicilarRepository.create({
      ...createKullanicilarDto,
      sifre: hashedPassword,
    });

    return await this.kullanicilarRepository.save(kullanici);
  }

  async findAll(): Promise<Kullanicilar[]> {
    const kullanicilar = await this.kullanicilarRepository.find({
      order: {
        id: 'DESC',
      },
    });

    // Şifreleri döndürme
    return kullanicilar.map((k) => {
      const { sifre, ...kullanici } = k;
      return kullanici as Kullanicilar;
    });
  }

  async findOne(id: number): Promise<Kullanicilar> {
    const kullanici = await this.kullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Kullanıcı #${id} bulunamadı`);
    }

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;
    return kullaniciData as Kullanicilar;
  }

  async update(
    id: number,
    updateKullanicilarDto: UpdateKullanicilarDto,
  ): Promise<Kullanicilar> {
    const kullanici = await this.kullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Kullanıcı #${id} bulunamadı`);
    }

    // Eğer şifre güncelleniyorsa hash'le
    if (updateKullanicilarDto.sifre) {
      updateKullanicilarDto.sifre = await bcrypt.hash(
        updateKullanicilarDto.sifre,
        10,
      );
    }

    Object.assign(kullanici, updateKullanicilarDto);
    const updated = await this.kullanicilarRepository.save(kullanici);

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = updated;
    return kullaniciData as Kullanicilar;
  }

  async remove(id: number): Promise<void> {
    const kullanici = await this.kullanicilarRepository.findOne({
      where: { id },
    });

    if (!kullanici) {
      throw new NotFoundException(`Kullanıcı #${id} bulunamadı`);
    }

    await this.kullanicilarRepository.remove(kullanici);
  }

  async login(loginDto: LoginKullaniciDto): Promise<Kullanicilar> {
    // Kullanıcı adı veya email ile ara
    const kullanici = await this.kullanicilarRepository.findOne({
      where: [
        { kullanici_adi: loginDto.kullanici_adi },
        { email: loginDto.kullanici_adi },
      ],
    });

    if (!kullanici) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // Durum kontrolü
    if (kullanici.durum !== 1) {
      throw new UnauthorizedException('Hesabınız aktif değil');
    }

    // Şifre kontrolü
    const sifreDogruMu = await bcrypt.compare(loginDto.sifre, kullanici.sifre);

    if (!sifreDogruMu) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // Şifreyi döndürme
    const { sifre, ...kullaniciData } = kullanici;
    return kullaniciData as Kullanicilar;
  }
}
