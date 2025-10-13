import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { TektasStokResponseDto } from './dto/tektas-stok.dto';

@Injectable()
export class TektasService {
  private readonly API_URL = 'https://tektas.boryaz.com/api/api.do';
  private readonly API_KEY = 'e3af442dc7f17c6d2a03c2168dfdde4c';

  async getStoklar(): Promise<TektasStokResponseDto> {
    try {
      const response = await axios.get(this.API_URL, {
        params: {
          KEY: this.API_KEY,
          ISLEM: 'apiStoklar',
        },
      });

      if (response.data.HATA === true) {
        throw new HttpException(
          `Tektas API Hatası: ${response.data.ACIKLAMA || response.data.data}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Tektas API bağlantı hatası: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStokByKodu(kodu: string): Promise<any> {
    try {
      const response = await axios.get(this.API_URL, {
        params: {
          KEY: this.API_KEY,
          ISLEM: 'stokDetay',
          KODU: kodu,
        },
      });

      if (response.data.HATA === true) {
        throw new HttpException(
          `Stok bulunamadı: ${response.data.ACIKLAMA || response.data.data}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Stok detay hatası: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchStok(query: string): Promise<TektasStokResponseDto> {
    try {
      const response = await axios.get(this.API_URL, {
        params: {
          KEY: this.API_KEY,
          ISLEM: 'stokAra',
          QUERY: query,
        },
      });

      if (response.data.HATA === true) {
        throw new HttpException(
          `Arama hatası: ${response.data.ACIKLAMA || response.data.data}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Arama hatası: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
