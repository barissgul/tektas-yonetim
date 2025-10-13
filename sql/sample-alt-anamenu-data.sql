-- Örnek: Genel Yönetim ana menüsü altında 2 alt ana menü grubu

-- Önce Genel Yönetim ana menüsünün ID'sini bulalım (varsayılan olarak 1)
-- Eğer yoksa oluşturalım
INSERT IGNORE INTO `anamenu` (`id`, `anamenu`, `rota`, `ikon`, `sira`) VALUES 
(1, 'Genel Yönetim', '#', 'PiGearDuotone', 1);

-- Alt Ana Menü 1: Sistem Yönetimi
INSERT INTO `alt_anamenu` (`alt_anamenu`, `anamenu_id`, `ikon`, `sira`) VALUES 
('Sistem Yönetimi', 1, 'PiShieldCheckDuotone', 1);

-- Alt Ana Menü 2: İçerik Yönetimi  
INSERT INTO `alt_anamenu` (`alt_anamenu`, `anamenu_id`, `ikon`, `sira`) VALUES 
('İçerik Yönetimi', 1, 'PiFilesDuotone', 2);

-- Alt Ana Menülerin ID'lerini alalım (son eklenen 2 kayıt)
SET @sistem_yonetimi_id = (SELECT id FROM alt_anamenu WHERE alt_anamenu = 'Sistem Yönetimi' ORDER BY id DESC LIMIT 1);
SET @icerik_yonetimi_id = (SELECT id FROM alt_anamenu WHERE alt_anamenu = 'İçerik Yönetimi' ORDER BY id DESC LIMIT 1);

-- Sistem Yönetimi alt menüleri
INSERT INTO `menu` (`menu`, `alt_anamenu_id`, `rota`, `ikon`, `sira`) VALUES 
('Kullanıcılar', @sistem_yonetimi_id, '/kullanicilar', 'PiUsersDuotone', 1),
('Yetkiler', @sistem_yonetimi_id, '/yetkiler', 'PiShieldDuotone', 2),
('Sistem Ayarları', @sistem_yonetimi_id, '/sistem-ayarlari', 'PiGearDuotone', 3);

-- İçerik Yönetimi alt menüleri
INSERT INTO `menu` (`menu`, `alt_anamenu_id`, `rota`, `ikon`, `sira`) VALUES 
('Menüler', @icerik_yonetimi_id, '/menuler', 'PiListBulletsDuotone', 1),
('Sayfalar', @icerik_yonetimi_id, '/sayfalar', 'PiFileTextDuotone', 2),
('Medya', @icerik_yonetimi_id, '/medya', 'PiImagesDuotone', 3);
