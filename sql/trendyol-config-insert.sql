-- Mevcut sanal_magaza tablosuna Trendyol config'ini ekle
INSERT INTO sanal_magaza (
  magaza_adi, 
  magaza_kodu, 
  api_url, 
  api_key, 
  api_secret, 
  satici_id, 
  baglanti_turu, 
  aktif, 
  notlar
)
VALUES (
  'Trendyol',
  'TRENDYOL_MAGAZA',
  'https://api.trendyol.com',
  'tKLRTVkb5a5iIPCw1dnR',
  '88p2orogIInTrWi1Vgme',
  '556267',
  'REST',
  1,
  'Trendyol API Entegrasyonu'
)
ON DUPLICATE KEY UPDATE
  api_key = 'tKLRTVkb5a5iIPCw1dnR',
  api_secret = '88p2orogIInTrWi1Vgme',
  satici_id = '556267',
  aktif = 1;

-- Kontrol
SELECT * FROM sanal_magaza WHERE magaza_kodu = 'TRENDYOL_MAGAZA';

