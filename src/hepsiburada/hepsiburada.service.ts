import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { HepsiburadaConfig } from './entities/hepsiburada-config.entity';
import { CreateHepsiburadaConfigDto } from './dto/create-hepsiburada-config.dto';
import { UpdateHepsiburadaConfigDto } from './dto/update-hepsiburada-config.dto';

@Injectable()
export class HepsiburadaService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(HepsiburadaConfig)
    private hepsiburadaConfigRepository: Repository<HepsiburadaConfig>,
  ) {}

  // Axios instance oluşturma - her config için ayrı
  private createAxiosInstance(config: HepsiburadaConfig): AxiosInstance {
    const authString = Buffer.from(
      `${config.username}:${config.password}`,
    ).toString('base64');

    return axios.create({
      baseURL: config.api_base_url,
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tektas-Yonetim/1.0',
      },
      timeout: 30000,
    });
  }

  // ==================== CONFIG CRUD ====================

  async createConfig(
    createDto: CreateHepsiburadaConfigDto,
  ): Promise<HepsiburadaConfig> {
    const existingConfig = await this.hepsiburadaConfigRepository.findOne({
      where: { magaza_kodu: createDto.magaza_kodu },
    });

    if (existingConfig) {
      throw new HttpException(
        'Bu mağaza kodu için zaten bir config var',
        HttpStatus.BAD_REQUEST,
      );
    }

    const config = this.hepsiburadaConfigRepository.create(createDto);
    return await this.hepsiburadaConfigRepository.save(config);
  }

  async getAllConfigs(): Promise<HepsiburadaConfig[]> {
    return await this.hepsiburadaConfigRepository.find();
  }

  async getConfigById(id: number): Promise<HepsiburadaConfig> {
    const config = await this.hepsiburadaConfigRepository.findOne({
      where: { id },
    });
    if (!config) {
      throw new HttpException('Config bulunamadı', HttpStatus.NOT_FOUND);
    }
    return config;
  }

  async getConfigByMagazaKodu(magazaKodu: string): Promise<HepsiburadaConfig> {
    const config = await this.hepsiburadaConfigRepository.findOne({
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

  async updateConfig(
    id: number,
    updateDto: UpdateHepsiburadaConfigDto,
  ): Promise<HepsiburadaConfig> {
    const config = await this.getConfigById(id);
    Object.assign(config, updateDto);
    return await this.hepsiburadaConfigRepository.save(config);
  }

  async deleteConfig(id: number): Promise<void> {
    const config = await this.getConfigById(id);
    await this.hepsiburadaConfigRepository.remove(config);
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
      const response = await instance.get(
        `/listings/merchantid/${config.merchant_id}`,
        {
          params: {
            offset,
            limit,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürünler çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductBySku(magazaKodu: string, merchantSku: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/listings/merchantid/${config.merchant_id}/sku/${merchantSku}`,
      );
      return response.data;
    } catch (error) {
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
        `/listings/merchantid/${config.merchant_id}`,
        {
          params: {
            offset,
            limit,
            status,
          },
        },
      );
      return response.data;
    } catch (error) {
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
        `/listings/merchantid/${config.merchant_id}/inventory`,
        stockUpdateData,
      );
      return response.data;
    } catch (error) {
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
        `/listings/merchantid/${config.merchant_id}/price`,
        priceUpdateData,
      );
      return response.data;
    } catch (error) {
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
        `/orders/merchantid/${config.merchant_id}`,
        { params },
      );
      return response.data;
    } catch (error) {
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
        `/orders/merchantid/${config.merchant_id}/ordernumber/${orderNumber}`,
      );
      return response.data;
    } catch (error) {
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
        `/orders/merchantid/${config.merchant_id}/acknowledge`,
        orderData,
      );
      return response.data;
    } catch (error) {
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
        `/orders/merchantid/${config.merchant_id}/shipments`,
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
        `/orders/merchantid/${config.merchant_id}/cancellations`,
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
