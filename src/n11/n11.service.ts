import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { N11Config } from './entities/n11-config.entity';
import { CreateN11ConfigDto } from './dto/create-n11-config.dto';
import { UpdateN11ConfigDto } from './dto/update-n11-config.dto';

@Injectable()
export class N11Service {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(N11Config)
    private n11ConfigRepository: Repository<N11Config>,
  ) {}

  // Axios instance oluşturma - her config için ayrı
  private createAxiosInstance(config: N11Config): AxiosInstance {
    const authString = Buffer.from(
      `${config.api_key}:${config.api_secret}`,
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

  async createConfig(createDto: CreateN11ConfigDto): Promise<N11Config> {
    const existingConfig = await this.n11ConfigRepository.findOne({
      where: { magaza_kodu: createDto.magaza_kodu },
    });

    if (existingConfig) {
      throw new HttpException(
        'Bu mağaza kodu için zaten bir config var',
        HttpStatus.BAD_REQUEST,
      );
    }

    const config = this.n11ConfigRepository.create(createDto);
    return await this.n11ConfigRepository.save(config);
  }

  async getAllConfigs(): Promise<N11Config[]> {
    return await this.n11ConfigRepository.find();
  }

  async getConfigById(id: number): Promise<N11Config> {
    const config = await this.n11ConfigRepository.findOne({
      where: { id },
    });
    if (!config) {
      throw new HttpException('Config bulunamadı', HttpStatus.NOT_FOUND);
    }
    return config;
  }

  async getConfigByMagazaKodu(magazaKodu: string): Promise<N11Config> {
    const config = await this.n11ConfigRepository.findOne({
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
    updateDto: UpdateN11ConfigDto,
  ): Promise<N11Config> {
    const config = await this.getConfigById(id);
    Object.assign(config, updateDto);
    return await this.n11ConfigRepository.save(config);
  }

  async deleteConfig(id: number): Promise<void> {
    const config = await this.getConfigById(id);
    await this.n11ConfigRepository.remove(config);
  }

  // ==================== ÜRÜN İŞLEMLERİ ====================

  async getProducts(
    magazaKodu: string,
    currentPage: number = 0,
    pageSize: number = 100,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/rest/productStock/v1/products', {
        params: {
          currentPage,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürünler çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductById(magazaKodu: string, productId: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/rest/productStock/v1/products/${productId}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürün detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductByStockCode(magazaKodu: string, stockCode: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        '/rest/productStock/v1/products/stockCode',
        {
          params: { stockCode },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürün bulunamadı: ${error.response?.data?.message || error.message}`,
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
        '/rest/productStock/v1/stock',
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
        '/rest/productStock/v1/price',
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
    startDate?: string,
    endDate?: string,
    status?: string,
    page: number = 0,
    size: number = 100,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const params: any = { page, size };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status) params.status = status;

      const response = await instance.get(
        '/rest/delivery/v1/shipmentPackages',
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

  async getOrderDetail(magazaKodu: string, orderNumber: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/rest/order/v1/orders/${orderNumber}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async acceptOrder(magazaKodu: string, orderData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        '/rest/order/v1/orders/accept',
        orderData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş kabul edilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rejectOrder(magazaKodu: string, rejectData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        '/rest/order/v1/orders/reject',
        rejectData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş reddedilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async shipOrder(magazaKodu: string, shipmentData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        '/rest/delivery/v1/shipmentPackages',
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

  // ==================== KATEGORİ İŞLEMLERİ ====================

  async getCategories(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/rest/category/v1/categories');
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kategoriler çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCategoryAttributes(magazaKodu: string, categoryId: number) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/rest/category/v1/categories/${categoryId}/attributes`,
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
      const response = await instance.get('/rest/brand/v1/brands');
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Markalar çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchBrands(magazaKodu: string, brandName: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get('/rest/brand/v1/brands/search', {
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
