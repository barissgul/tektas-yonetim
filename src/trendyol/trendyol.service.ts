import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios, { AxiosInstance } from 'axios';
import { TrendyolConfig } from './entities/trendyol-config.entity';
import { TrendyolOrder } from './entities/trendyol-order.entity';
import { TrendyolOrderLine } from './entities/trendyol-order-line.entity';
import { TrendyolPackageHistory } from './entities/trendyol-package-history.entity';
import { CreateTrendyolConfigDto } from './dto/create-trendyol-config.dto';
import { UpdateTrendyolConfigDto } from './dto/update-trendyol-config.dto';

@Injectable()
export class TrendyolService {
  private axiosInstance: AxiosInstance;

  constructor(
    @InjectRepository(TrendyolConfig)
    private trendyolConfigRepository: Repository<TrendyolConfig>,
    @InjectRepository(TrendyolOrder)
    private trendyolOrderRepository: Repository<TrendyolOrder>,
    @InjectRepository(TrendyolOrderLine)
    private trendyolOrderLineRepository: Repository<TrendyolOrderLine>,
    @InjectRepository(TrendyolPackageHistory)
    private trendyolPackageHistoryRepository: Repository<TrendyolPackageHistory>,
  ) {}

  // Axios instance oluşturma - her config için ayrı
  private createAxiosInstance(config: TrendyolConfig): AxiosInstance {
    // Trendyol API için username: api_key, password: api_secret
    const username = config.api_key;
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
    } catch (error: any) {
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
    } catch (error: any) {
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
      console.log('Trendyol API Request:', {
        url: `/suppliers/${config.satici_id}/products`,
        params: { page, size },
        config: {
          magaza_kodu: config.magaza_kodu,
          satici_id: config.satici_id,
          api_key: config.api_key.substring(0, 10) + '...', // Güvenlik için sadece ilk 10 karakter
        }
      });

      const response = await instance.get(
        `/suppliers/${config.satici_id}/products`,
        {
          params: {
            page,
            size,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error('Trendyol API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          magaza_kodu: config.magaza_kodu,
          satici_id: config.satici_id,
        },
      });

      // Products endpoint çalışmıyorsa, orders'tan product bilgilerini çıkar
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.log(
          "Products endpoint erişim hatası, orders'tan product bilgileri çıkarılacak...",
        );
        try {
          // Birden fazla sayfa çek ve product bilgilerini çıkar
          const allProducts = new Map();
          // Daha fazla sayfa çek (50 sayfa = 5000 sipariş)
          for (let pageNum = 0; pageNum < 50; pageNum++) {
            const ordersResponse = await instance.get(
              `/suppliers/${config.satici_id}/orders`,
              {
                params: {
                  page: pageNum,
                  size: 100,
                  orderByField: 'PackageLastModifiedDate',
                  orderByDirection: 'DESC',
                },
              },
            );

            // Her sayfadan product'ları çıkar
            ordersResponse.data.content.forEach((order: any) => {
              if (order.lines) {
                order.lines.forEach((line: any) => {
                  const productKey = line.productCode || line.sku;
                  if (productKey && !allProducts.has(productKey)) {
                    allProducts.set(productKey, {
                      id: line.productCode?.toString() || line.sku,
                      title: line.productName,
                      description: line.productName,
                      barcode: line.barcode,
                      brand: 'Bilinmiyor', // Orders'ta brand bilgisi yok
                      categoryId: line.productCategoryId,
                      salePrice: line.price,
                      listPrice: line.price,
                      quantity: 0, // Orders'ta stok bilgisi yok
                      productCode: line.productCode?.toString() || line.sku,
                      stockCode: line.sku,
                      images: [{ url: `https://cdn.dsmcdn.com/ty${line.productCode}/product/images/${line.sku}/1_org.jpg` }],
                    });
                  }
                });
              }
            });
          }

          const productList = Array.from(allProducts.values());
          
          // Sayfalama uygula
          const startIndex = page * size;
          const endIndex = startIndex + size;
          const paginatedProducts = productList.slice(startIndex, endIndex);

          return {
            content: paginatedProducts,
            totalPages: Math.ceil(productList.length / size),
            totalElements: productList.length,
            page: page,
            size: size,
          };
        } catch (ordersError: any) {
          console.error(
            "Orders'tan product bilgileri çıkarılamadı:",
            ordersError,
          );
        }
      }

      let errorMessage = 'Ürünler çekilemedi';
      if (error.response?.status === 403) {
        errorMessage =
          'Trendyol API erişim izni reddedildi. API anahtarlarınızı kontrol edin.';
      } else if (error.response?.status === 401) {
        errorMessage =
          'Trendyol API kimlik doğrulama hatası. API anahtarlarınızı kontrol edin.';
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

  async getProductById(magazaKodu: string, productId: string) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const response = await instance.get(
        `/suppliers/${config.satici_id}/products/${productId}`,
      );
      return response.data;
    } catch (error: any) {
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
    orderNumber?: string,
    status?: string,
    orderByField: string = 'PackageLastModifiedDate',
    orderByDirection: string = 'DESC',
    shipmentPackageIds?: string,
  ) {
    const config = await this.getConfigByMagazaKodu(magazaKodu);
    const instance = this.createAxiosInstance(config);

    try {
      const params: any = {
        page,
        size,
        orderByField,
        orderByDirection,
      };

      // Trendyol API tarihleri timestamp formatında bekler (milliseconds) ve GMT +3
      if (startDate) {
        const date = new Date(startDate);
        params.startDate = date.getTime();
      }
      if (endDate) {
        const date = new Date(endDate);
        params.endDate = date.getTime();
      }
      if (orderNumber) {
        params.orderNumber = orderNumber;
      }
      if (status) {
        params.status = status;
      }
      if (shipmentPackageIds) {
        params.shipmentPackageIds = shipmentPackageIds;
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

  // ==================== SİPARİŞ VERİTABANI İŞLEMLERİ ====================

  async saveOrdersFromApi(magazaKodu: string, ordersData: any[]): Promise<{ saved: number; updated: number; errors: string[] }> {
    let saved = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const orderData of ordersData) {
      try {
        const result = await this.saveOrder(orderData, magazaKodu);
        if (result.isNew) {
          saved++;
        } else {
          updated++;
        }
      } catch (error) {
        errors.push(`Sipariş ${orderData.orderNumber}: ${error.message}`);
      }
    }

    return { saved, updated, errors };
  }

  async saveOrder(orderData: any, magazaKodu: string): Promise<{ order: TrendyolOrder; isNew: boolean }> {
    // Mevcut siparişi kontrol et
    const existingOrder = await this.trendyolOrderRepository.findOne({
      where: { orderNumber: orderData.orderNumber }
    });

    let order: TrendyolOrder;
    let isNew = false;

    if (existingOrder) {
      // Güncelle
      order = existingOrder;
      this.updateOrderFromApiData(order, orderData, magazaKodu);
    } else {
      // Yeni sipariş oluştur
      order = new TrendyolOrder();
      this.updateOrderFromApiData(order, orderData, magazaKodu);
      isNew = true;
    }

    // Siparişi kaydet
    const savedOrder = await this.trendyolOrderRepository.save(order);

    // Sipariş detaylarını kaydet
    if (orderData.lines && orderData.lines.length > 0) {
      await this.saveOrderLines(savedOrder.id, orderData.orderNumber, orderData.lines);
    }

    // Package histories'yi kaydet
    if (orderData.packageHistories && orderData.packageHistories.length > 0) {
      await this.savePackageHistories(savedOrder.id, orderData.orderNumber, orderData.packageHistories);
    }

    return { order: savedOrder, isNew };
  }

  private updateOrderFromApiData(order: TrendyolOrder, orderData: any, magazaKodu: string): void {
    order.id = orderData.id;
    order.orderNumber = orderData.orderNumber;
    order.customerId = orderData.customerId;
    order.customerFirstName = orderData.customerFirstName;
    order.customerLastName = orderData.customerLastName;
    order.customerEmail = orderData.customerEmail;
    order.grossAmount = orderData.grossAmount;
    order.totalDiscount = orderData.totalDiscount;
    order.totalTyDiscount = orderData.totalTyDiscount;
    order.totalPrice = orderData.totalPrice;
    order.currencyCode = orderData.currencyCode || 'TRY';
    order.orderDate = orderData.orderDate;
    order.identityNumber = orderData.identityNumber;
    order.cargoTrackingNumber = orderData.cargoTrackingNumber;
    order.cargoTrackingLink = orderData.cargoTrackingLink;
    order.cargoProviderName = orderData.cargoProviderName;
    order.cargoDeci = orderData.cargoDeci;
    order.status = orderData.status;
    order.shipmentPackageStatus = orderData.shipmentPackageStatus;
    order.deliveryType = orderData.deliveryType;
    order.timeSlotId = orderData.timeSlotId || 0;
    order.estimatedDeliveryStartDate = orderData.estimatedDeliveryStartDate;
    order.estimatedDeliveryEndDate = orderData.estimatedDeliveryEndDate;
    order.agreedDeliveryDate = orderData.agreedDeliveryDate;
    order.fastDelivery = orderData.fastDelivery || false;
    order.fastDeliveryType = orderData.fastDeliveryType;
    order.originShipmentDate = orderData.originShipmentDate;
    order.lastModifiedDate = orderData.lastModifiedDate;
    order.commercial = orderData.commercial || false;
    order.deliveredByService = orderData.deliveredByService || false;
    order.agreedDeliveryDateExtendible = orderData.agreedDeliveryDateExtendible || false;
    order.extendedAgreedDeliveryDate = orderData.extendedAgreedDeliveryDate || 0;
    order.agreedDeliveryExtensionEndDate = orderData.agreedDeliveryExtensionEndDate || 0;
    order.agreedDeliveryExtensionStartDate = orderData.agreedDeliveryExtensionStartDate || 0;
    order.warehouseId = orderData.warehouseId;
    order.groupDeal = orderData.groupDeal || false;
    order.invoiceLink = orderData.invoiceLink;
    order.micro = orderData.micro || false;
    order.giftBoxRequested = orderData.giftBoxRequested || false;
    order.is3pByTrendyol = orderData['3pByTrendyol'] || false;
    order.containsDangerousProduct = orderData.containsDangerousProduct || false;
    order.isCod = orderData.isCod || false;
    order.createdBy = orderData.createdBy;
    order.originPackageIds = orderData.originPackageIds;
    order.taxNumber = orderData.taxNumber;
    order.deliveryAddressType = orderData.deliveryAddressType;
    
    // Adres bilgileri JSON olarak
    order.shipmentAddress = orderData.shipmentAddress;
    order.invoiceAddress = orderData.invoiceAddress;
    
    order.magazaKodu = magazaKodu;
  }

  private async saveOrderLines(orderId: number, orderNumber: string, lines: any[]): Promise<void> {
    // Mevcut sipariş detaylarını sil
    await this.trendyolOrderLineRepository.delete({ orderId });

    // Yeni sipariş detaylarını kaydet
    for (const lineData of lines) {
      const orderLine = new TrendyolOrderLine();
      orderLine.id = lineData.id;
      orderLine.orderId = orderId;
      orderLine.orderNumber = orderNumber;
      orderLine.quantity = lineData.quantity;
      orderLine.salesCampaignId = lineData.salesCampaignId;
      orderLine.productSize = lineData.productSize;
      orderLine.merchantSku = lineData.merchantSku;
      orderLine.productName = lineData.productName;
      orderLine.productCode = lineData.productCode;
      orderLine.merchantId = lineData.merchantId;
      orderLine.amount = lineData.amount;
      orderLine.discount = lineData.discount;
      orderLine.tyDiscount = lineData.tyDiscount;
      orderLine.currencyCode = lineData.currencyCode || 'TRY';
      orderLine.productColor = lineData.productColor;
      orderLine.sku = lineData.sku;
      orderLine.vatBaseAmount = lineData.vatBaseAmount;
      orderLine.barcode = lineData.barcode;
      orderLine.orderLineItemStatusName = lineData.orderLineItemStatusName;
      orderLine.price = lineData.price;
      orderLine.productCategoryId = lineData.productCategoryId;
      orderLine.commission = lineData.commission;
      orderLine.discountDetails = lineData.discountDetails;
      orderLine.fastDeliveryOptions = lineData.fastDeliveryOptions;

      await this.trendyolOrderLineRepository.save(orderLine);
    }
  }

  private async savePackageHistories(orderId: number, orderNumber: string, histories: any[]): Promise<void> {
    // Mevcut package histories'yi sil
    await this.trendyolPackageHistoryRepository.delete({ orderId });

    // Yeni package histories'yi kaydet
    for (const historyData of histories) {
      const packageHistory = new TrendyolPackageHistory();
      packageHistory.orderId = orderId;
      packageHistory.orderNumber = orderNumber;
      packageHistory.createdDate = historyData.createdDate;
      packageHistory.status = historyData.status;

      await this.trendyolPackageHistoryRepository.save(packageHistory);
    }
  }

  // Veritabanından siparişleri getir
  async getOrdersFromDb(magazaKodu?: string, page: number = 0, size: number = 50): Promise<{ orders: TrendyolOrder[]; total: number }> {
    const queryBuilder = this.trendyolOrderRepository.createQueryBuilder('order');

    if (magazaKodu) {
      queryBuilder.where('order.magazaKodu = :magazaKodu', { magazaKodu });
    }

    queryBuilder
      .orderBy('order.orderDate', 'DESC')
      .skip(page * size)
      .take(size);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return { orders, total };
  }

  // Veritabanından sipariş detayını getir
  async getOrderFromDb(orderNumber: string): Promise<TrendyolOrder | null> {
    return await this.trendyolOrderRepository.findOne({
      where: { orderNumber },
      relations: ['lines']
    });
  }
}
