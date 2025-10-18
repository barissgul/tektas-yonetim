-- Siparişler Tablosu
CREATE TABLE IF NOT EXISTS siparisler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siparis_no VARCHAR(50) UNIQUE NOT NULL COMMENT 'Benzersiz sipariş numarası',
  sanal_magaza_id INT NOT NULL COMMENT 'Hangi mağazadan geldiği',
  
  -- Müşteri Bilgileri
  musteri_adi VARCHAR(100) COMMENT 'Müşteri adı',
  musteri_soyadi VARCHAR(100) COMMENT 'Müşteri soyadı',
  musteri_email VARCHAR(255) COMMENT 'Müşteri email',
  musteri_telefon VARCHAR(20) COMMENT 'Müşteri telefon',
  
  -- Fiyat Bilgileri
  ara_toplam DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Ara toplam (ürünler toplamı)',
  kargo_ucreti DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Kargo ücreti',
  indirim_tutari DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'İndirim tutarı',
  toplam_tutar DECIMAL(10, 2) NOT NULL COMMENT 'Toplam sipariş tutarı',
  para_birimi VARCHAR(3) DEFAULT 'TRY' COMMENT 'Para birimi',
  
  -- Kargo Bilgileri
  kargo_firmasi VARCHAR(100) COMMENT 'Kargo firması adı',
  kargo_takip_no VARCHAR(100) COMMENT 'Kargo takip numarası',
  kargo_takip_link TEXT COMMENT 'Kargo takip linki',
  
  -- Adres Bilgileri (JSON)
  teslimat_adresi JSON COMMENT 'Teslimat adresi bilgileri',
  fatura_adresi JSON COMMENT 'Fatura adresi bilgileri',
  
  -- Sipariş Durumu
  durum VARCHAR(50) NOT NULL DEFAULT 'Beklemede' COMMENT 'Sipariş durumu (Beklemede, Hazırlanıyor, Kargoya Verildi, Teslim Edildi, İptal)',
  odeme_durumu VARCHAR(50) DEFAULT 'Ödenmedi' COMMENT 'Ödeme durumu (Ödendi, Ödenmedi, İade)',
  odeme_yontemi VARCHAR(50) COMMENT 'Ödeme yöntemi (Kredi Kartı, Havale, Kapıda Ödeme)',
  
  -- Tarih Bilgileri
  siparis_tarihi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Sipariş verilme tarihi',
  onay_tarihi TIMESTAMP NULL COMMENT 'Sipariş onay tarihi',
  kargo_tarihi TIMESTAMP NULL COMMENT 'Kargoya verilme tarihi',
  teslim_tarihi TIMESTAMP NULL COMMENT 'Teslim edilme tarihi',
  
  -- Notlar
  musteri_notu TEXT COMMENT 'Müşteri notu',
  yonetici_notu TEXT COMMENT 'Yönetici/İç not',
  
  -- Platform Bilgisi
  platform_siparis_id VARCHAR(100) COMMENT 'Platform üzerindeki orijinal sipariş ID (Trendyol, N11, vb.)',
  
  -- Sistem Alanları
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Key
  FOREIGN KEY (sanal_magaza_id) REFERENCES sanal_magaza(id) ON DELETE RESTRICT,
  
  -- Index'ler
  INDEX idx_siparis_no (siparis_no),
  INDEX idx_sanal_magaza_id (sanal_magaza_id),
  INDEX idx_durum (durum),
  INDEX idx_odeme_durumu (odeme_durumu),
  INDEX idx_siparis_tarihi (siparis_tarihi),
  INDEX idx_musteri_email (musteri_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sipariş Yönetimi Ana Tablosu';

-- Sipariş Detayları Tablosu (Sipariş Kalemleri)
CREATE TABLE IF NOT EXISTS siparis_detaylari (
  id INT AUTO_INCREMENT PRIMARY KEY,
  siparis_id INT NOT NULL COMMENT 'Sipariş ID (siparisler tablosundan)',
  
  -- Ürün Bilgileri
  urun_id INT NULL COMMENT 'Ürün ID (urunler tablosundan) - NULL olabilir (platform ürünü)',
  urun_kodu VARCHAR(100) COMMENT 'Ürün/Stok Kodu',
  urun_adi VARCHAR(255) NOT NULL COMMENT 'Ürün adı',
  barkod VARCHAR(50) COMMENT 'Barkod',
  
  -- Varyant Bilgileri
  varyant_bilgisi VARCHAR(255) COMMENT 'Varyant (Renk, Beden vb.)',
  
  -- Miktar ve Fiyat
  miktar INT NOT NULL DEFAULT 1 COMMENT 'Sipariş miktarı',
  birim_fiyat DECIMAL(10, 2) NOT NULL COMMENT 'Birim fiyat',
  indirim DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Kalem bazında indirim',
  toplam DECIMAL(10, 2) NOT NULL COMMENT 'Kalem toplamı (miktar * birim_fiyat - indirim)',
  
  -- Vergi Bilgileri
  kdv_orani DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'KDV oranı (%)',
  kdv_tutari DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'KDV tutarı',
  
  -- Platform Bilgisi
  platform_urun_id VARCHAR(100) COMMENT 'Platform üzerindeki ürün ID',
  platform_kalem_id VARCHAR(100) COMMENT 'Platform üzerindeki sipariş kalem ID',
  
  -- Durum
  durum VARCHAR(50) DEFAULT 'Beklemede' COMMENT 'Kalem durumu',
  
  -- Sistem Alanları
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (siparis_id) REFERENCES siparisler(id) ON DELETE CASCADE,
  FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE SET NULL,
  
  -- Index'ler
  INDEX idx_siparis_id (siparis_id),
  INDEX idx_urun_id (urun_id),
  INDEX idx_urun_kodu (urun_kodu),
  INDEX idx_barkod (barkod)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sipariş Detayları/Kalemleri Tablosu';

-- Örnek Siparişler
INSERT INTO siparisler (
  siparis_no, 
  sanal_magaza_id, 
  musteri_adi, 
  musteri_soyadi, 
  musteri_email, 
  musteri_telefon,
  ara_toplam,
  kargo_ucreti,
  indirim_tutari,
  toplam_tutar,
  kargo_firmasi,
  kargo_takip_no,
  teslimat_adresi,
  fatura_adresi,
  durum,
  odeme_durumu,
  odeme_yontemi,
  siparis_tarihi,
  musteri_notu
) VALUES
(
  'SIP-2025-0001',
  1,
  'Ahmet',
  'Yılmaz',
  'ahmet.yilmaz@email.com',
  '0532 111 22 33',
  450.00,
  29.90,
  0.00,
  479.90,
  'MNG Kargo',
  '123456789012',
  '{"ad_soyad": "Ahmet Yılmaz", "adres": "Atatürk Cad. No:123 Daire:4", "sehir": "İstanbul", "ilce": "Kadıköy", "posta_kodu": "34710", "telefon": "0532 111 22 33"}',
  '{"ad_soyad": "Ahmet Yılmaz", "adres": "Atatürk Cad. No:123 Daire:4", "sehir": "İstanbul", "ilce": "Kadıköy", "posta_kodu": "34710"}',
  'Kargoya Verildi',
  'Ödendi',
  'Kredi Kartı',
  '2025-10-15 10:30:00',
  'Kapıda bırakılabilir'
),
(
  'SIP-2025-0002',
  1,
  'Ayşe',
  'Demir',
  'ayse.demir@email.com',
  '0533 222 33 44',
  890.00,
  0.00,
  50.00,
  840.00,
  'Yurtiçi Kargo',
  '987654321098',
  '{"ad_soyad": "Ayşe Demir", "adres": "İnönü Bulvarı No:45", "sehir": "Ankara", "ilce": "Çankaya", "posta_kodu": "06100", "telefon": "0533 222 33 44"}',
  '{"ad_soyad": "Ayşe Demir", "adres": "İnönü Bulvarı No:45", "sehir": "Ankara", "ilce": "Çankaya", "posta_kodu": "06100"}',
  'Hazırlanıyor',
  'Ödendi',
  'Havale/EFT',
  '2025-10-16 14:20:00',
  'İş saatlerinde arayın'
),
(
  'SIP-2025-0003',
  1,
  'Mehmet',
  'Kaya',
  'mehmet.kaya@email.com',
  '0534 333 44 55',
  1250.00,
  29.90,
  125.00,
  1154.90,
  NULL,
  NULL,
  '{"ad_soyad": "Mehmet Kaya", "adres": "Cumhuriyet Mah. Barış Sok. No:7", "sehir": "İzmir", "ilce": "Konak", "posta_kodu": "35250", "telefon": "0534 333 44 55"}',
  '{"ad_soyad": "Mehmet Kaya", "adres": "Cumhuriyet Mah. Barış Sok. No:7", "sehir": "İzmir", "ilce": "Konak", "posta_kodu": "35250"}',
  'Beklemede',
  'Ödenmedi',
  'Kapıda Ödeme',
  '2025-10-17 09:15:00',
  NULL
),
(
  'SIP-2025-0004',
  1,
  'Fatma',
  'Şahin',
  'fatma.sahin@email.com',
  '0535 444 55 66',
  675.50,
  29.90,
  0.00,
  705.40,
  'Aras Kargo',
  '456789123456',
  '{"ad_soyad": "Fatma Şahin", "adres": "Zafer Cad. No:89 Kat:2", "sehir": "Bursa", "ilce": "Osmangazi", "posta_kodu": "16200", "telefon": "0535 444 55 66"}',
  '{"ad_soyad": "Fatma Şahin", "adres": "Zafer Cad. No:89 Kat:2", "sehir": "Bursa", "ilce": "Osmangazi", "posta_kodu": "16200"}',
  'Teslim Edildi',
  'Ödendi',
  'Kredi Kartı',
  '2025-10-13 16:45:00',
  'Hızlı teslimat istiyorum'
);

-- Sipariş Detayları (Örnek ürünler - urunler tablosundan gerçek ürün ID'leri kullanılabilir)
INSERT INTO siparis_detaylari (
  siparis_id,
  urun_id,
  urun_kodu,
  urun_adi,
  barkod,
  varyant_bilgisi,
  miktar,
  birim_fiyat,
  indirim,
  toplam,
  kdv_orani,
  kdv_tutari,
  durum
) VALUES
-- Sipariş 1 kalemleri
(1, 1, 'URT001', 'Tektas Granit Seramik 60x60', '8690123456789', 'Gri - Mat', 5, 89.90, 0.00, 449.50, 18.00, 80.91, 'Onaylandı'),
(1, 2, 'URT002', 'Tektas Porselen Karo 80x80', '8690123456790', 'Beyaz - Parlak', 2, 149.90, 0.00, 299.80, 18.00, 53.96, 'Onaylandı'),

-- Sipariş 2 kalemleri
(2, 1, 'URT001', 'Tektas Granit Seramik 60x60', '8690123456789', 'Siyah - Mat', 10, 89.90, 50.00, 849.00, 18.00, 152.82, 'Hazırlanıyor'),
(2, 3, 'URT003', 'Tektas Banyo Fayansı 30x60', '8690123456791', NULL, 2, 45.90, 0.00, 91.80, 18.00, 16.52, 'Hazırlanıyor'),

-- Sipariş 3 kalemleri
(3, 2, 'URT002', 'Tektas Porselen Karo 80x80', '8690123456790', 'Bej - Parlak', 8, 149.90, 100.00, 1099.20, 18.00, 197.86, 'Beklemede'),
(3, 1, 'URT001', 'Tektas Granit Seramik 60x60', '8690123456789', 'Kahverengi - Mat', 3, 89.90, 25.00, 244.70, 18.00, 44.05, 'Beklemede'),

-- Sipariş 4 kalemleri
(4, 3, 'URT003', 'Tektas Banyo Fayansı 30x60', '8690123456791', 'Mavi - Desenli', 12, 45.90, 0.00, 550.80, 18.00, 99.14, 'Teslim Edildi'),
(4, 1, 'URT001', 'Tektas Granit Seramik 60x60', '8690123456789', NULL, 2, 89.90, 0.00, 179.80, 18.00, 32.36, 'Teslim Edildi');

