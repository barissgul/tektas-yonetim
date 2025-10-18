-- Ürünler Tablosu
CREATE TABLE IF NOT EXISTS urunler (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sanal_magaza_id INT NOT NULL,
  urun_kodu VARCHAR(100) NOT NULL COMMENT 'Ürün/Stok Kodu (SKU)',
  urun_adi VARCHAR(255) NOT NULL COMMENT 'Ürün Adı',
  aciklama TEXT NULL COMMENT 'Ürün Açıklaması',
  kategori VARCHAR(100) NULL COMMENT 'Ürün Kategorisi',
  marka VARCHAR(100) NULL COMMENT 'Ürün Markası',
  barkod VARCHAR(50) NULL COMMENT 'Barkod',
  fiyat DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Satış Fiyatı',
  maliyet DECIMAL(10, 2) NULL COMMENT 'Maliyet Fiyatı',
  stok_miktari INT NOT NULL DEFAULT 0 COMMENT 'Mevcut Stok Miktarı',
  min_stok_miktari INT NULL DEFAULT 0 COMMENT 'Minimum Stok Uyarı Seviyesi',
  birim VARCHAR(20) NULL DEFAULT 'Adet' COMMENT 'Birim (Adet, Kg, Lt vb.)',
  resim_url VARCHAR(500) NULL COMMENT 'Ürün Resim URL',
  durum TINYINT NOT NULL DEFAULT 1 COMMENT '1: Aktif, 0: Pasif',
  olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Key
  FOREIGN KEY (sanal_magaza_id) REFERENCES sanal_magaza(id) ON DELETE CASCADE,
  
  -- Index'ler
  INDEX idx_sanal_magaza_id (sanal_magaza_id),
  INDEX idx_urun_kodu (urun_kodu),
  INDEX idx_barkod (barkod),
  INDEX idx_durum (durum),
  
  -- Unique constraint (Aynı mağazada aynı ürün kodu olamaz)
  UNIQUE KEY unique_magaza_urun (sanal_magaza_id, urun_kodu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ürün Yönetimi Tablosu';

-- Örnek veri
INSERT INTO urunler (sanal_magaza_id, urun_kodu, urun_adi, aciklama, kategori, marka, barkod, fiyat, maliyet, stok_miktari, min_stok_miktari, birim, durum) VALUES
(1, 'URT001', 'Tektas Granit Seramik 60x60', 'Birinci sınıf granit seramik, mat yüzey', 'Seramik', 'Tektas', '8690123456789', 89.90, 65.00, 150, 20, 'Adet', 1),
(1, 'URT002', 'Tektas Porselen Karo 80x80', 'Yüksek kalite porselen karo, parlak yüzey', 'Seramik', 'Tektas', '8690123456790', 149.90, 110.00, 80, 15, 'Adet', 1),
(1, 'URT003', 'Tektas Banyo Fayansı 30x60', 'Su geçirmez banyo fayansı', 'Fayans', 'Tektas', '8690123456791', 45.90, 30.00, 200, 30, 'Adet', 1);

