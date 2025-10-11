# Tektas Yönetim API

NestJS, MySQL ve TypeORM kullanarak geliştirilmiş Tektas Yönetim Backend API'si.

## Kurulum

```bash
npm install
```

## Çalıştırma

### Development modunda çalıştırma
```bash
npm run start:dev
```

### Production build
```bash
npm run build
npm run start:prod
```

## API Dokümantasyonu

Uygulama çalıştırıldıktan sonra Swagger dokümantasyonuna şu adresten erişebilirsiniz:
```
http://localhost:4000/api
```

## Veritabanı Ayarları

Uygulama MySQL veritabanı kullanmaktadır. `.env` dosyasında aşağıdaki ayarları yapabilirsiniz:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=tektas
```

## API Endpoint'leri

### Anamenu (Ana Menü)
- `GET /anamenu` - Tüm ana menüleri listele (alt menülerle birlikte)
- `GET /anamenu/:id` - Tek ana menü detayı
- `POST /anamenu` - Yeni ana menü oluştur
- `PATCH /anamenu/:id` - Ana menü güncelle
- `DELETE /anamenu/:id` - Ana menü sil

### Menu (Alt Menü)
- `GET /menu` - Tüm menüleri listele (ana menü ilişkisiyle)
- `GET /menu/:id` - Tek menü detayı
- `POST /menu` - Yeni menü oluştur
- `PATCH /menu/:id` - Menü güncelle
- `DELETE /menu/:id` - Menü sil

### Yetkiler
- `GET /yetkiler` - Tüm yetkileri listele
- `GET /yetkiler/:id` - Tek yetki detayı
- `POST /yetkiler` - Yeni yetki oluştur
- `PATCH /yetkiler/:id` - Yetki güncelle
- `DELETE /yetkiler/:id` - Yetki sil

### Kullanıcılar
- `GET /kullanicilar` - Tüm kullanıcıları listele
- `GET /kullanicilar/:id` - Tek kullanıcı detayı
- `POST /kullanicilar` - Yeni kullanıcı oluştur
- `POST /kullanicilar/login` - Kullanıcı girişi
- `PATCH /kullanicilar/:id` - Kullanıcı güncelle
- `DELETE /kullanicilar/:id` - Kullanıcı sil

### Sanal Mağaza
- `GET /sanal-magaza` - Tüm mağazaları listele
- `GET /sanal-magaza/aktif` - Sadece aktif mağazaları listele
- `GET /sanal-magaza/:id` - Tek mağaza detayı
- `GET /sanal-magaza/kod/:magaza_kodu` - Mağaza koduna göre getir
- `POST /sanal-magaza` - Yeni mağaza oluştur
- `PATCH /sanal-magaza/:id` - Mağaza güncelle
- `PATCH /sanal-magaza/:id/toggle-active` - Mağaza aktif/pasif durumunu değiştir
- `DELETE /sanal-magaza/:id` - Mağaza sil

### Trendyol Entegrasyonu 🆕

#### Config Yönetimi
- `POST /trendyol/config` - Yeni Trendyol config oluştur
- `GET /trendyol/config` - Tüm configleri listele
- `GET /trendyol/config/:id` - Config detayı
- `PATCH /trendyol/config/:id` - Config güncelle
- `DELETE /trendyol/config/:id` - Config sil

#### Ürün İşlemleri
- `GET /trendyol/:magazaKodu/products` - Ürünleri listele (sayfalama destekli)
- `GET /trendyol/:magazaKodu/products/:productId` - Ürün detayı
- `GET /trendyol/:magazaKodu/products/filter/brand?brandName=X` - Markaya göre ürün filtrele
- `POST /trendyol/:magazaKodu/products/update-stock` - Stok güncelle
- `POST /trendyol/:magazaKodu/products/update-price` - Fiyat güncelle

#### Sipariş İşlemleri
- `GET /trendyol/:magazaKodu/orders` - Siparişleri listele (tarih filtreleme destekli)
- `GET /trendyol/:magazaKodu/orders/:orderNumber` - Sipariş detayı
- `PUT /trendyol/:magazaKodu/orders/:orderNumber/status` - Sipariş durumu güncelle
- `POST /trendyol/:magazaKodu/orders/:orderNumber/shipment` - Kargo bildirimi yap

#### Kategori ve Marka İşlemleri
- `GET /trendyol/:magazaKodu/categories` - Kategorileri listele
- `GET /trendyol/:magazaKodu/categories/:categoryId/attributes` - Kategori özelliklerini getir
- `GET /trendyol/:magazaKodu/brands` - Markaları listele
- `GET /trendyol/:magazaKodu/brands/search?name=X` - Marka ara

### Hepsiburada Entegrasyonu 🆕

#### Config Yönetimi
- `POST /hepsiburada/config` - Yeni Hepsiburada config oluştur
- `GET /hepsiburada/config` - Tüm configleri listele
- `GET /hepsiburada/config/:id` - Config detayı
- `PATCH /hepsiburada/config/:id` - Config güncelle
- `DELETE /hepsiburada/config/:id` - Config sil

#### Ürün İşlemleri
- `GET /hepsiburada/:magazaKodu/products` - Ürünleri listele
- `GET /hepsiburada/:magazaKodu/products/:merchantSku` - Ürün detayı (SKU ile)
- `GET /hepsiburada/:magazaKodu/products/filter/status?status=Active` - Duruma göre ürün filtrele
- `POST /hepsiburada/:magazaKodu/products/update-stock` - Stok güncelle
- `POST /hepsiburada/:magazaKodu/products/update-price` - Fiyat güncelle

#### Sipariş İşlemleri
- `GET /hepsiburada/:magazaKodu/orders` - Siparişleri listele (tarih filtreleme destekli)
- `GET /hepsiburada/:magazaKodu/orders/:orderNumber` - Sipariş detayı
- `POST /hepsiburada/:magazaKodu/orders/acknowledge` - Siparişi onayla
- `POST /hepsiburada/:magazaKodu/orders/shipment` - Kargo bildirimi yap
- `POST /hepsiburada/:magazaKodu/orders/cancel` - Siparişi iptal et

#### Kategori ve Marka İşlemleri
- `GET /hepsiburada/:magazaKodu/categories` - Kategorileri listele
- `GET /hepsiburada/:magazaKodu/categories/:categoryId/attributes` - Kategori özelliklerini getir
- `GET /hepsiburada/:magazaKodu/brands` - Markaları listele
- `GET /hepsiburada/:magazaKodu/brands/search?name=X` - Marka ara

### N11 Entegrasyonu 🆕

#### Config Yönetimi
- `POST /n11/config` - Yeni N11 config oluştur
- `GET /n11/config` - Tüm configleri listele
- `GET /n11/config/:id` - Config detayı
- `PATCH /n11/config/:id` - Config güncelle
- `DELETE /n11/config/:id` - Config sil

#### Ürün İşlemleri
- `GET /n11/:magazaKodu/products` - Ürünleri listele
- `GET /n11/:magazaKodu/products/:productId` - Ürün detayı
- `GET /n11/:magazaKodu/products/stockCode/:stockCode` - Stok koduna göre ürün getir
- `POST /n11/:magazaKodu/products/update-stock` - Stok güncelle
- `POST /n11/:magazaKodu/products/update-price` - Fiyat güncelle

#### Sipariş İşlemleri
- `GET /n11/:magazaKodu/orders` - Siparişleri listele (tarih ve durum filtreleme)
- `GET /n11/:magazaKodu/orders/:orderNumber` - Sipariş detayı
- `POST /n11/:magazaKodu/orders/accept` - Siparişi kabul et
- `POST /n11/:magazaKodu/orders/reject` - Siparişi reddet
- `POST /n11/:magazaKodu/orders/shipment` - Kargo bildirimi yap

#### Kategori ve Marka İşlemleri
- `GET /n11/:magazaKodu/categories` - Kategorileri listele
- `GET /n11/:magazaKodu/categories/:categoryId/attributes` - Kategori özelliklerini getir
- `GET /n11/:magazaKodu/brands` - Markaları listele
- `GET /n11/:magazaKodu/brands/search?name=X` - Marka ara

## Özellikler

- ✅ NestJS Framework
- ✅ MySQL Database (TypeORM)
- ✅ Swagger API Dokümantasyonu
- ✅ Environment Configuration
- ✅ CORS Desteği
- ✅ Auto-sync Database (Development modunda)
- ✅ Validation (class-validator)
- ✅ İlişkisel Tablolar (OneToMany/ManyToOne)
- ✅ **Trendyol Marketplace API Entegrasyonu** 🆕
  - Ürün yönetimi (listeleme, detay, filtreleme)
  - Sipariş yönetimi (listeleme, durum güncelleme, kargo bildirimi)
  - Stok ve fiyat güncelleme
  - Kategori ve marka yönetimi
  - Multi-store desteği (birden fazla mağaza)
- ✅ **Hepsiburada Marketplace API Entegrasyonu** 🆕
  - Ürün yönetimi (listeleme, SKU ile sorgulama, durum filtreleme)
  - Sipariş yönetimi (listeleme, onaylama, kargo, iptal)
  - Stok ve fiyat güncelleme
  - Kategori ve marka yönetimi
  - Multi-store desteği (birden fazla mağaza)
- ✅ **N11 Marketplace API Entegrasyonu** 🆕
  - Ürün yönetimi (listeleme, stok kodu ile sorgulama)
  - Sipariş yönetimi (listeleme, kabul/red, kargo bildirimi)
  - Stok ve fiyat güncelleme
  - Kategori ve marka yönetimi
  - Multi-store desteği (birden fazla mağaza)

## Trendyol Kullanımı

### 1. Config Oluşturma
Öncelikle Trendyol satıcı panelinden API Key ve Secret'ınızı alın, sonra:

```bash
POST /trendyol/config
{
  "magaza_kodu": "MAGAZA001",
  "supplier_id": "123456",
  "api_key": "your-api-key",
  "api_secret": "your-api-secret",
  "aktif": true
}
```

### 2. Ürünleri Çekme
```bash
GET /trendyol/MAGAZA001/products?page=0&size=50
```

### 3. Siparişleri Çekme
```bash
GET /trendyol/MAGAZA001/orders?startDate=2024-01-01&endDate=2024-12-31
```

### 4. Stok Güncelleme
```bash
POST /trendyol/MAGAZA001/products/update-stock
{
  "items": [
    {
      "barcode": "1234567890123",
      "quantity": 100
    }
  ]
}
```

Daha fazla detay için Swagger dokümantasyonuna bakın: `http://localhost:3000/api`

## Hepsiburada Kullanımı

### 1. Config Oluşturma
Öncelikle Hepsiburada satıcı panelinden API Username ve Password'ünüzü alın, sonra:

```bash
POST /hepsiburada/config
{
  "magaza_kodu": "MAGAZA001",
  "merchant_id": "123456",
  "username": "your-username",
  "password": "your-password",
  "aktif": true
}
```

### 2. Ürünleri Çekme
```bash
GET /hepsiburada/MAGAZA001/products?offset=0&limit=50
```

### 3. Siparişleri Çekme
```bash
GET /hepsiburada/MAGAZA001/orders?beginDate=2024-01-01&endDate=2024-12-31
```

### 4. Sipariş Onaylama
```bash
POST /hepsiburada/MAGAZA001/orders/acknowledge
{
  "orderNumber": "HB-123456789",
  "lines": [
    {
      "lineItemId": "123456",
      "quantity": 1
    }
  ]
}
```

### 5. Stok Güncelleme
```bash
POST /hepsiburada/MAGAZA001/products/update-stock
{
  "items": [
    {
      "merchantSku": "SKU123",
      "availableStock": 100
    }
  ]
}
```

Daha fazla detay için Swagger dokümantasyonuna bakın: `http://localhost:3000/api`

## N11 Kullanımı

### 1. Config Oluşturma
Öncelikle N11 satıcı panelinden API Key ve Secret'ınızı alın, sonra:

```bash
POST /n11/config
{
  "magaza_kodu": "MAGAZA001",
  "api_key": "your-api-key",
  "api_secret": "your-api-secret",
  "aktif": true
}
```

### 2. Ürünleri Çekme
```bash
GET /n11/MAGAZA001/products?currentPage=0&pageSize=100
```

### 3. Stok Koduna Göre Ürün Getirme
```bash
GET /n11/MAGAZA001/products/stockCode/SKU123
```

### 4. Siparişleri Çekme
```bash
GET /n11/MAGAZA001/orders?startDate=2024-01-01&endDate=2024-12-31&status=Created
```

### 5. Sipariş Kabul Etme
```bash
POST /n11/MAGAZA001/orders/accept
{
  "orderNumber": "N11-123456789"
}
```

### 6. Stok Güncelleme
```bash
POST /n11/MAGAZA001/products/update-stock
{
  "items": [
    {
      "productId": "123456",
      "quantity": 100
    }
  ]
}
```

Daha fazla detay için Swagger dokümantasyonuna bakın: `http://localhost:3000/api`

## Teknolojiler

- **Framework:** NestJS
- **Database:** MySQL
- **ORM:** TypeORM
- **Documentation:** Swagger/OpenAPI
- **Language:** TypeScript
