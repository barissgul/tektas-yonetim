import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { TrendyolConfig } from './entities/trendyol-config.entity';
import { CreateTrendyolConfigDto } from './dto/create-trendyol-config.dto';
import { UpdateTrendyolConfigDto } from './dto/update-trendyol-config.dto';

@Injectable()
export class TrendyolService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(TrendyolConfig)
    private trendyolConfigRepository: Repository<TrendyolConfig>,
  ) {}

  // Axios instance oluşturma - her config için ayrı
  private createAxiosInstance(config: TrendyolConfig): AxiosInstance {
    // Trendyol API için username formatı: supplier_id-api_key
    const username = `${config.satici_id}-${config.api_key}`;
    const password = config.api_secret;
    const authString = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );

    return axios.create({
      baseURL: 'https://api.trendyol.com/sapigw',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
        'User-Agent': `${config.satici_id} - SelfIntegration`,
      },
      timeout: 30000,
    });
  }

  // ==================== CONFIG CRUD ====================

  async createConfig(
    createDto: CreateTrendyolConfigDto,
  ): Promise<TrendyolConfig> {
    const existingConfig = await this.trendyolConfigRepository.findOne({
      where: { magaza_kodu: createDto.magaza_kodu },
    });

    if (existingConfig) {
      throw new HttpException(
        'Bu mağaza kodu için zaten bir config var',
        HttpStatus.BAD_REQUEST,
      );
    }

    const config = this.trendyolConfigRepository.create(createDto);
    return await this.trendyolConfigRepository.save(config);
  }

  async getAllConfigs(): Promise<TrendyolConfig[]> {
    return await this.trendyolConfigRepository.find();
  }

  async getConfigById(id: number): Promise<TrendyolConfig> {
    const config = await this.trendyolConfigRepository.findOne({
      where: { id },
    });
    if (!config) {
      throw new HttpException('Config bulunamadı', HttpStatus.NOT_FOUND);
    }
    return config;
  }

  async getConfigByMagazaKodu(magazaKodu: string): Promise<TrendyolConfig> {
    const config = await this.trendyolConfigRepository.findOne({
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
    updateDto: UpdateTrendyolConfigDto,
  ): Promise<TrendyolConfig> {
    const config = await this.getConfigById(id);
    Object.assign(config, updateDto);
    return await this.trendyolConfigRepository.save(config);
  }

  async deleteConfig(id: number): Promise<void> {
    const config = await this.getConfigById(id);
    await this.trendyolConfigRepository.remove(config);
  }

  // ==================== ÜRÜN İŞLEMLERİ ====================

  async createProduct(magazaKodu: string, productData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/v2/products`,
        productData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürün oluşturulamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(magazaKodu: string, productData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.put(
        `/suppliers/${config.satici_id}/v2/products`,
        productData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürün güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProducts(magazaKodu: string, page: number = 0, size: number = 50) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/products`,
        {
          params: {
            page,
            size,
            approved: true, // Sadece onaylanmış ürünler
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

  async getProductById(magazaKodu: string, productId: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/products/${productId}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ürün detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filterProductsByBrand(
    magazaKodu: string,
    brandName: string,
    page: number = 0,
    size: number = 50,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/products`,
        {
          params: {
            page,
            size,
            approved: true,
            brandName,
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

  async getBatchRequestResult(magazaKodu: string, batchRequestId: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/products/batch-requests/${batchRequestId}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Batch request sonucu alınamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getShipmentProviders(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);

    try {
      const response = await axios.get(
        'https://api.trendyol.com/sapigw/shipment-providers',
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kargo firmaları çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAddresses(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/addresses`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Adresler çekilemedi: ${error.response?.data?.message || error.message}`,
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
        `/suppliers/${config.satici_id}/products/price-and-inventory`,
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
        `/suppliers/${config.satici_id}/products/price-and-inventory`,
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
    page: number = 0,
    size: number = 50,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const params: any = {
        page,
        size,
        orderByField: 'PackageLastModifiedDate',
        orderByDirection: 'DESC',
      };

      // Trendyol API tarihleri timestamp formatında bekler (milliseconds)
      if (startDate) {
        const date = new Date(startDate);
        params.startDate = date.getTime();
      }
      if (endDate) {
        const date = new Date(endDate);
        params.endDate = date.getTime();
      }

      const response = await instance.get(
        `/suppliers/${config.satici_id}/orders`,
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
        `/suppliers/${config.satici_id}/orders/${orderNumber}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş detayı çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(
    magazaKodu: string,
    orderNumber: string,
    status: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.put(
        `/suppliers/${config.satici_id}/orders/${orderNumber}/status`,
        { status },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Sipariş durumu güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async shipOrder(magazaKodu: string, orderNumber: string, shipmentData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/orders/${orderNumber}/shipment`,
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

  async updateTrackingNumber(
    magazaKodu: string,
    shipmentPackageId: string,
    trackingNumber: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.put(
        `/suppliers/${config.satici_id}/${shipmentPackageId}/update-tracking-number`,
        { trackingNumber },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kargo takip kodu güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePackageStatus(
    magazaKodu: string,
    shipmentPackageId: string,
    updateData: any,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.put(
        `/suppliers/${config.satici_id}/shipment-packages/${shipmentPackageId}`,
        updateData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Paket statü güncellenemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendInvoiceLink(magazaKodu: string, invoiceData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/supplier-invoice-links`,
        invoiceData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Fatura linki gönderilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async splitPackage(
    magazaKodu: string,
    shipmentPackageId: string,
    splitData: any,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/shipment-packages/${shipmentPackageId}/split-packages`,
        splitData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Paket bölünemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeCargoProvider(
    magazaKodu: string,
    shipmentPackageId: string,
    cargoProvider: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/shipment-packages/${shipmentPackageId}/cargo-providers`,
        { cargoProvider },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Kargo firması değiştirilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== KATEGORİ İŞLEMLERİ ====================

  async getCategories(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);

    try {
      // Kategoriler için genel integration API kullan (auth gerektirmez)
      const response = await axios.get(
        'https://apigw.trendyol.com/integration/product/product-categories',
      );
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

    try {
      // Kategori özellikleri için integration API kullan (auth gerektirmez)
      const response = await axios.get(
        `https://apigw.trendyol.com/integration/product-categories/${categoryId}/attributes`,
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

  async getBrands(magazaKodu: string, page: number = 0, size: number = 100) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);

    try {
      // Markalar için genel integration API kullan (auth gerektirmez)
      const response = await axios.get(
        'https://apigw.trendyol.com/integration/product/brands',
        {
          params: { page, size },
        },
      );
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

    try {
      const response = await axios.get(
        'https://apigw.trendyol.com/integration/product/brands',
        {
          params: { name: brandName },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Marka bulunamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== İADE İŞLEMLERİ ====================

  async getClaims(
    magazaKodu: string,
    page: number = 0,
    size: number = 50,
    startDate?: string,
    endDate?: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const params: any = { page, size };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await instance.get(
        `/suppliers/${config.satici_id}/claims`,
        { params },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `İade siparişleri çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createClaim(magazaKodu: string, claimData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/claims/create`,
        claimData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `İade talebi oluşturulamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveClaim(magazaKodu: string, claimId: string, approveData: any) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.put(
        `/claims/${claimId}/items/approve`,
        approveData,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `İade onaylanamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rejectClaim(
    magazaKodu: string,
    claimId: string,
    claimIssueReasonId: number,
    claimItemIdList: string,
    description: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/claims/${claimId}/issue`,
        null,
        {
          params: {
            claimIssueReasonId,
            claimItemIdList,
            description,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `İade reddedilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getClaimIssueReasons(magazaKodu: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);

    try {
      const response = await axios.get(
        'https://api.trendyol.com/sapigw/claim-issue-reasons',
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `İade red sebepleri çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ==================== SORU-CEVAP İŞLEMLERİ ====================

  async getQuestions(magazaKodu: string, page: number = 0, size: number = 50) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/questions/filter`,
        {
          params: { page, size },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Müşteri soruları çekilemedi: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async answerQuestion(magazaKodu: string, questionId: string, text: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.post(
        `/suppliers/${config.satici_id}/questions/${questionId}/answers`,
        { text },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Soru cevaplanamadı: ${error.response?.data?.message || error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
