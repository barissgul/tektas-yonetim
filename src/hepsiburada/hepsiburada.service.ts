import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { SanalMagaza } from '../sanal-magaza/entities/sanal-magaza.entity';

@Injectable()
export class HepsiburadaService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(SanalMagaza)
    private sanalMagazaRepository: Repository<SanalMagaza>,
  ) {}

  // Axios instance oluşturma - her config için ayrı
  private createAxiosInstance(config: SanalMagaza): AxiosInstance {
    // Hepsiburada API'de username:secret_key formatında Basic Auth kullanılıyor
    // PHP örneğine göre: new Hepsiburada('merchant_id','username','secret_key')
    const authString = Buffer.from(
      `${config.api_key}:${config.api_secret}`,
    ).toString('base64');

    return axios.create({
      baseURL: config.api_url,
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tektas-Yonetim/1.0',
      },
      timeout: 30000,
    });
  }

  // ==================== CONFIG CRUD ====================

  async getConfigByMagazaKodu(magazaKodu: string): Promise<SanalMagaza> {
    const config = await this.sanalMagazaRepository.findOne({
      where: { magaza_kodu: magazaKodu, aktif: true },
    });
    if (!config) {
      throw new HttpException(
        'Config bulunamadı veya aktif değil',
        HttpStatus.NOT_FOUND,
      );
    }
    return config;
  }


  // ==================== ÜRÜN İŞLEMLERİ ====================

  async getProducts(
    magazaKodu: string,
    offset: number = 0,
    limit: number = 50,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      // Hepsiburada API dokümantasyonuna göre doğru endpoint
      // PHP örneğinde listing->getList() kullanılıyor
      const response = await instance.get(
        `/listings`,
        {
          params: {
            offset,
            limit,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Hepsiburada API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          magaza_kodu: config.magaza_kodu,
          satici_id: config.satici_id,
        },
      });

      let errorMessage = 'Ürünler çekilemedi';
      if (error.response?.status === 403) {
        errorMessage = 'Hepsiburada API erişim izni reddedildi. API anahtarlarınızı kontrol edin.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Hepsiburada API kimlik doğrulama hatası. API anahtarlarınızı kontrol edin.';
      } else if (error.response?.data?.message) {
        errorMessage = `Ürünler çekilemedi: ${error.response.data.message}`;
      } else {
        errorMessage = `Ürünler çekilemedi: ${error.message}`;
      }

      throw new HttpException(
        errorMessage,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductBySku(magazaKodu: string, merchantSku: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/listings/merchantid/${config.satici_id}/sku/${merchantSku}`,
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Ürün detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filterProductsByStatus(
    magazaKodu: string,
    status: string,
    offset: number = 0,
    limit: number = 50,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/listings/merchantid/${config.satici_id}`,
        {
          params: {
            offset,
            limit,
            status,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Ürünler filtrelenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== STOK GÜNCELLEMESİ ====================

  async updateStock(magazaKodu: string, stockUpdateData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/listings/merchantid/${config.satici_id}/inventory`,
        stockUpdateData,
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Stok güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== FİYAT GÜNCELLEMESİ ====================

  async updatePrice(magazaKodu: string, priceUpdateData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/listings/merchantid/${config.satici_id}/price`,
        priceUpdateData,
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Fiyat güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== SİPARİŞ İŞLEMLERİ ====================

  async getOrders(
    magazaKodu: string,
    beginDate?: string,
    endDate?: string,
    offset: number = 0,
    limit: number = 50,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const params: any = { offset, limit };

      if (beginDate) params.beginDate = beginDate;
      if (endDate) params.endDate = endDate;

      const response = await instance.get(
        `/orders/merchantid/${config.satici_id}`,
        { params },
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Siparişler çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(magazaKodu: string, orderNumber: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/orders/merchantid/${config.satici_id}/ordernumber/${orderNumber}`,
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Sipariş detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async acknowledgeOrder(magazaKodu: string, orderData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/orders/merchantid/${config.satici_id}/acknowledge`,
        orderData,
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `Sipariş onaylanamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async shipOrder(magazaKodu: string, shipmentData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/orders/merchantid/${config.satici_id}/shipments`,
        shipmentData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kargo bildirimi yapılamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelOrder(magazaKodu: string, cancelData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/orders/merchantid/${config.satici_id}/cancellations`,
        cancelData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş iptal edilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== KATEGORİ İŞLEMLERİ ====================

  async getCategories(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/categories');
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kategoriler çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryAttributes(magazaKodu: string, categoryId: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/categories/${categoryId}/attributes`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kategori özellikleri çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== MARKA İŞLEMLERİ ====================

  async getBrands(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/brands');
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Markalar çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBrandByName(magazaKodu: string, brandName: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/brands', {
        params: { name: brandName },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Marka bulunamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
