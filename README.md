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

## Özellikler

- ✅ NestJS Framework
- ✅ MySQL Database (TypeORM)
- ✅ Swagger API Dokümantasyonu
- ✅ Environment Configuration
- ✅ CORS Desteği
- ✅ Auto-sync Database (Development modunda)
- ✅ Validation (class-validator)
- ✅ İlişkisel Tablolar (OneToMany/ManyToOne)

## Teknolojiler

- **Framework:** NestJS
- **Database:** MySQL
- **ORM:** TypeORM
- **Documentation:** Swagger/OpenAPI
- **Language:** TypeScript
